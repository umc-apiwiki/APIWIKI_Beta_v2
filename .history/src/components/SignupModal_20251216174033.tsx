// src/components/SignupModal.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ModalBase from './ModalBase';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 비밀번호 확인
        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다');
            return;
        }

        // 비밀번호 길이 확인
        if (formData.password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다');
            return;
        }

        setIsLoading(true);

        try {
            // 회원가입 API 호출
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || '회원가입 중 오류가 발생했습니다');
                return;
            }

            // 회원가입 성공 후 자동 로그인
            const signInResult = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.ok) {
                onClose();
                router.refresh();
            } else {
                // 자동 로그인 실패 시 로그인 모달로 전환
                setError('회원가입은 완료되었습니다. 로그인해주세요.');
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            }
        } catch (err) {
            setError('서버 오류가 발생했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        });
        setError('');
        onClose();
    };

    return (
        <ModalBase isOpen={isOpen} onClose={handleClose} title="회원가입">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        이름
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="홍길동"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                    </label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="example@email.com"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                        비밀번호
                    </label>
                    <input
                        id="signup-password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="최소 6자 이상"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        비밀번호 확인
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="비밀번호를 다시 입력하세요"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? '가입 중...' : '회원가입'}
                </button>

                <div className="text-center text-sm text-gray-600">
                    이미 계정이 있으신가요?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-teal-500 hover:text-teal-600 font-medium"
                    >
                        로그인
                    </button>
                </div>
            </form>
        </ModalBase>
    );
}
