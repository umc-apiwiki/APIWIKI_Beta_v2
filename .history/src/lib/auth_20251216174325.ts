// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';
import type { UserGrade } from '@/types';

export const authOptions: NextAuthOptions = {
    providers: [
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
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isPasswordValid) {
                    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
                }

                // 로그인 활동 기록 (activity_score 증가)
                await supabase
                    .from('User')
                    .update({
                        activity_score: user.activity_score + 1,
                        updatedAt: new Date().toISOString()
                    })
                    .eq('id', user.id);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    grade: user.grade as UserGrade,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.grade = user.grade;
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
