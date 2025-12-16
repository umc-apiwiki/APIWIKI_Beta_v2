// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        // 입력 검증
        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, error: '모든 필드를 입력해주세요' },
                { status: 400 }
            );
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: '올바른 이메일 형식이 아닙니다' },
                { status: 400 }
            );
        }

        // 비밀번호 길이 검증
        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: '비밀번호는 최소 6자 이상이어야 합니다' },
                { status: 400 }
            );
        }

        // 이메일 중복 확인
        const { data: existingUser } = await supabase
            .from('User')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: '이미 사용 중인 이메일입니다' },
                { status: 409 }
            );
        }

        // 비밀번호 해싱
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 사용자 생성
        const { data: newUser, error } = await supabase
            .from('User')
            .insert({
                email,
                name,
                password_hash,
                grade: 'bronze',
                activity_score: 0,
            })
            .select('id, email, name, grade')
            .single();

        if (error) {
            console.error('회원가입 실패:', error);
            return NextResponse.json(
                { success: false, error: '회원가입 중 오류가 발생했습니다' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '회원가입이 완료되었습니다',
            user: newUser,
        });
    } catch (error) {
        console.error('회원가입 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}
