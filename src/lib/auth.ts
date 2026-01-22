// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';
import type { UserGrade } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    // 기존 이메일/비밀번호 로그인
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요');
        }

        // Supabase에서 사용자 조회
        const { data: user, error } = await supabase
          .from('User')
          .select('id, email, name, password_hash, grade, activity_score')
          .eq('email', credentials.email)
          .single();

        if (error || !user) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isPasswordValid) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
        }

        // 로그인 활동 기록
        try {
          await supabase.rpc('log_user_login', { user_id: user.id });
          // 마지막 로그인 시간 업데이트
          await supabase
            .from('User')
            .update({ updatedAt: new Date().toISOString() })
            .eq('id', user.id);
        } catch (error) {
          console.error('로그인 활동 기록 실패:', error);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          grade: user.grade as UserGrade,
          activity_score: user.activity_score,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth 로그인 시 사용자 정보 저장 또는 업데이트
      if (account?.provider === 'google' || account?.provider === 'github') {
        const { data: existingUser } = await supabase
          .from('User')
          .select('id, email, grade, activity_score, avatar_url')
          .eq('email', user.email)
          .single();

        const avatarUrl = user.image || (profile as any)?.picture;

        if (!existingUser) {
          // 신규 사용자 생성
          const { error } = await supabase.from('User').insert({
            email: user.email,
            name: user.name || (profile as any)?.name || user.email?.split('@')[0],
            grade: 'bronze',
            activity_score: 1,
            avatar_url: avatarUrl,
          });

          if (error) {
            console.error('사용자 생성 오류:', error);
            return false;
          }
        } else {
          // 로그인 활동 기록
          try {
            await supabase.rpc('log_user_login', { user_id: existingUser.id });
          } catch (error) {
            console.error('로그인 활동 기록 실패:', error);
          }

          // 프로필 이미지 등 업데이트
          const updates: any = {
            updatedAt: new Date().toISOString(),
          };

          if (avatarUrl && existingUser.avatar_url !== avatarUrl) {
            updates.avatar_url = avatarUrl;
          }

          await supabase.from('User').update(updates).eq('id', existingUser.id);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // 1. 초기 로그인 시 사용자 정보 토큰에 저장 (여기서 user.id는 OAuth의 경우 Provider ID일 수 있음)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.grade = user.grade;
        if (user.avatar_url) {
          token.avatar_url = user.avatar_url;
        }
        if ((user as any).activity_score !== undefined) {
          token.activity_score = (user as any).activity_score;
        }
      }

      // 2. OAuth 로그인 시 DB에서 실제 사용자 정보(UUID 등)를 다시 조회하여 덮어쓰기
      if (account?.provider === 'google' || account?.provider === 'github') {
        const { data: dbUser } = await supabase
          .from('User')
          .select('id, email, name, grade, avatar_url, activity_score')
          .eq('email', token.email)
          .single();

        if (dbUser) {
          token.id = dbUser.id; // Provider ID를 내부 UUID로 교체
          token.grade = dbUser.grade;
          token.avatar_url = dbUser.avatar_url;
          token.activity_score = dbUser.activity_score;
        }
      }

      // 3. 토큰에 activity_score가 없으면 DB에서 한 번 더 조회해 채움 (이전 세션 호환)
      if (token.activity_score === undefined && token.email) {
        const { data: scoreUser } = await supabase
          .from('User')
          .select('activity_score')
          .eq('email', token.email)
          .single();

        if (scoreUser) {
          token.activity_score = scoreUser.activity_score;
        }
      }

      // 4. 세션 갱신 시점마다 최신 점수/등급을 DB에서 재확인 (실시간 반영)
      if (token.id) {
        const { data: freshUser } = await supabase
          .from('User')
          .select('activity_score, grade, avatar_url')
          .eq('id', token.id)
          .single();

        if (freshUser) {
          token.activity_score = freshUser.activity_score;
          token.grade = freshUser.grade;
          token.avatar_url = freshUser.avatar_url ?? token.avatar_url;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          grade: token.grade,
          avatar_url: token.avatar_url,
          activity_score: token.activity_score,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // 로그인 페이지는 모달로 처리하므로 홈으로 리다이렉트
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  secret: process.env.NEXTAUTH_SECRET,
};
