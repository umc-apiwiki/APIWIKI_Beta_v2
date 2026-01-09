// src/components/LoginModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignup?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
            setLoginError('');
            setFormData({ email: '', password: '' });
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else if (result?.ok) {
                onClose();
                router.refresh();
            }
        } catch (error) {
            setLoginError('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            console.error('Google login error:', error);
            setLoginError('Google 로그인 중 오류가 발생했습니다.');
            setIsLoading(false);
        }
    };

    // const handleGithubLogin = async () => {
    //     setIsLoading(true);
    //     try {
    //         await signIn('github', { callbackUrl: '/' });
    //     } catch (error) {
    //         console.error('Github login error:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

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

                        <form onSubmit={handleCredentialsLogin} className="w-full space-y-3">
                            <input 
                                type="text"
                                name="email"
                                placeholder="아이디"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-[52px] px-5 rounded-2xl border border-gray-200 bg-white text-[15px] focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-all placeholder:text-gray-400"
                                disabled={isLoading}
                            />
                            <input 
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full h-[52px] px-5 rounded-2xl border border-gray-200 bg-white text-[15px] focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-all placeholder:text-gray-400"
                                disabled={isLoading}
                            />
                            
                             {loginError && (
                                <p className="text-[13px] text-red-500 text-center mt-1 font-medium">{loginError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-[52px] rounded-full bg-[#2196F3] text-white font-bold text-[16px] hover:bg-[#1E88E5] transition-all shadow-[0_4px_14px_0_rgba(33,150,243,0.39)] mt-2 active:scale-[0.98]"
                            >
                                {isLoading ? '로그인 중...' : '로그인'}
                            </button>
                        </form>
                        
                        <div className="flex items-center justify-center gap-4 mt-5 text-[12px] text-gray-400 font-medium">
                            <button className="hover:text-gray-600 transition-colors">아이디 찾기</button>
                            <div className="w-[1px] h-3 bg-gray-300"></div>
                            <button className="hover:text-gray-600 transition-colors">비밀번호 찾기</button>
                            <div className="w-[1px] h-3 bg-gray-300"></div>
                            <button onClick={onSwitchToSignup} className="hover:text-gray-600 transition-colors">회원가입</button>
                        </div>

                         <div className="w-full mt-8 space-y-3">
                             <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full h-[52px] rounded-full border border-gray-200 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-all active:scale-[0.98]"
                             >
                                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-5 h-5"/>
                                 <span className="text-[14px] font-bold text-[#1f2937]">Sign up with Google</span>
                             </button>
                             <button
                                // onClick={handleGithubLogin}
                                disabled={true} 
                                className="w-full h-[52px] rounded-full border border-gray-200 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-all opacity-60 cursor-not-allowed"
                             >
                                 <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GH" className="w-5 h-5"/>
                                 <span className="text-[14px] font-bold text-[#1f2937]">Sign up with Github</span>
                             </button>
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
