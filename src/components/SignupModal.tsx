// src/components/SignupModal.tsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

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
        <AnimatePresence>
             {isOpen && (
                <motion.div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-[6px] flex items-center justify-center z-[2000]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleClose}
                >
                    <motion.div 
                        className="bg-white rounded-[32px] w-[380px] p-8 relative flex flex-col items-center shadow-2xl"
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                         <button
                            className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors"
                            onClick={handleClose}
                        >
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                         <div className="flex flex-col items-center mb-8 mt-2">
                            <img src="/logo.svg" alt="API Wiki" className="h-[60px] mb-2" />
                            <h2 className="text-[#2196F3] text-[26px] font-bold tracking-tight">API Wiki</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full space-y-3">
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="닉네임"
                                className="w-full h-[52px] px-5 rounded-2xl border border-gray-200 bg-white text-[15px] focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-all placeholder:text-gray-400"
                                disabled={isLoading}
                            />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="이메일"
                                className="w-full h-[52px] px-5 rounded-2xl border border-gray-200 bg-white text-[15px] focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-all placeholder:text-gray-400"
                                disabled={isLoading}
                            />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="비밀번호"
                                className="w-full h-[52px] px-5 rounded-2xl border border-gray-200 bg-white text-[15px] focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-all placeholder:text-gray-400"
                                disabled={isLoading}
                            />
                             <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="비밀번호 확인"
                                className="w-full h-[52px] px-5 rounded-2xl border border-gray-200 bg-white text-[15px] focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-all placeholder:text-gray-400"
                                disabled={isLoading}
                            />

                            {error && (
                                <p className="text-[13px] text-red-500 text-center mt-1 font-medium">{error}</p>
                            )}

                             <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-[52px] rounded-full bg-[#2196F3] text-white font-bold text-[16px] hover:bg-[#1E88E5] transition-all shadow-[0_4px_14px_0_rgba(33,150,243,0.39)] mt-5 active:scale-[0.98]"
                            >
                                {isLoading ? '회원가입' : '회원가입'}
                            </button>
                        </form>

                        <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-gray-400 font-medium">
                           <span>이미 계정이 있으신가요?</span>
                            <button onClick={onSwitchToLogin} className="hover:text-gray-600 font-medium transition-colors">로그인</button>
                        </div>
                        
                         <div className="mt-8 text-[10px] text-gray-300 text-center leading-normal">
                             계속 진행할 경우 API WIKI의 이용약관에 동의하고<br/>
                             개인정보 처리 방침을 이해하는 것으로 간주됩니다.
                         </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
