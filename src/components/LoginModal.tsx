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
    const [showBetaMessage, setShowBetaMessage] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        onClose();
    };

    const handleLoginAttempt = () => {
        setShowBetaMessage(true);
        setTimeout(() => setShowBetaMessage(false), 4000);
    };

    // 실제 로그인 구현 시 사용할 함수들 (현재는 비활성화)
    const handleGoogleLogin = async () => {
        handleLoginAttempt();
        // setIsLoading(true);
        // try {
        //     await signIn('google', { callbackUrl: '/' });
        // } catch (error) {
        //     console.error('Google login error:', error);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const handleGithubLogin = async () => {
        handleLoginAttempt();
        // setIsLoading(true);
        // try {
        //     await signIn('github', { callbackUrl: '/' });
        // } catch (error) {
        //     console.error('Github login error:', error);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 bg-black/[0.18] backdrop-blur-[3px] flex items-center justify-center z-[2000]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleClose}
                >
                    <motion.div 
                        className="bg-white rounded-[25px] w-[390px] p-[40px] relative text-center"
                        style={{
                            boxShadow: 'var(--shadow-blue)',
                            border: '0.5px solid var(--primary-blue)'
                        }}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                {/* Close Button */}
                <span
                    className="absolute top-[20px] right-[20px] w-[24px] h-[24px] cursor-pointer text-[24px] text-[#aaa] opacity-50 hover:opacity-100 transition-opacity"
                    onClick={handleClose}
                >
                    &times;
                </span>

                {/* Logo */}
                <div className="text-center mb-[20px]">
                    <div className="h-[150px] flex items-center justify-center mb-[-20px]">
                        <img 
                            src="/logo.svg" 
                            alt="API Wiki Logo" 
                            className="h-[120px] w-auto"
                        />
                    </div>
                    <h2 
                        className="text-[32px] font-bold mb-[10px]"
                        style={{ color: 'var(--primary-blue)' }}
                    >
                        API Wiki
                    </h2>
                    <div className="mb-[30px]">
                        <p 
                            className="text-[18px] font-semibold mb-[8px]"
                            style={{ color: 'var(--text-dark)' }}
                        >
                            로그인 하고 경험을 공유해요!
                        </p>
                        <p 
                            className="text-[14px] leading-[1.6]"
                            style={{ color: 'var(--text-gray)' }}
                        >
                            현재 Beta 버전에서는 로그인 없이도<br />
                            대부분의 기능을 이용할 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* Beta Message */}
                <AnimatePresence>
                    {showBetaMessage && (
                        <motion.div
                            className="mb-4 p-4 rounded-[15px] border-2"
                            style={{
                                backgroundColor: 'rgba(33, 150, 243, 0.05)',
                                borderColor: 'var(--primary-blue)'
                            }}
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-left">
                                <p className="text-[15px] font-semibold mb-1" style={{ color: 'var(--primary-blue)' }}>
                                    Beta 버전 안내
                                </p>
                                <p className="text-[13px] leading-[1.6]" style={{ color: 'var(--text-dark)' }}>
                                    로그인 기능은 곧 출시될 예정입니다.<br />
                                    현재는 로그인 없이 모든 기능을 자유롭게 이용하실 수 있습니다! 😊
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Login Buttons */}
                <div className="relative">
                    <motion.button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full py-[15px] px-[20px] mb-[15px] rounded-[50px] border border-[#E0E0E9] bg-white flex items-center justify-center gap-[12px] text-[18px] font-medium text-[#1D1C2B] cursor-pointer disabled:opacity-50 relative"
                        style={{ boxShadow: '0px 18px 30px rgba(130, 119, 197, 0.11)' }}
                        whileHover={{ y: -2, backgroundColor: '#f8f8f8' }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="absolute top-[-8px] right-[10px] px-2 py-0.5 text-[11px] font-bold rounded-full text-white" style={{ backgroundColor: '#FF9800' }}>
                            Coming Soon
                        </span>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign up with Google
                    </motion.button>

                    <motion.button
                        onClick={handleGithubLogin}
                        disabled={isLoading}
                        className="w-full py-[15px] px-[20px] mb-[15px] rounded-[50px] border border-[#E0E0E9] bg-white flex items-center justify-center gap-[12px] text-[18px] font-medium text-[#1D1C2B] cursor-pointer disabled:opacity-50 relative"
                        style={{ boxShadow: '0px 18px 30px rgba(130, 119, 197, 0.11)' }}
                        whileHover={{ y: -2, backgroundColor: '#f8f8f8' }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="absolute top-[-8px] right-[10px] px-2 py-0.5 text-[11px] font-bold rounded-full text-white" style={{ backgroundColor: '#FF9800' }}>
                            Coming Soon
                        </span>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="#24292F" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                        Sign up with Github
                    </motion.button>
                </div>

                {/* Footer */}
                <div 
                    className="text-center text-[11px] leading-[1.5] mt-[30px]"
                    style={{ color: 'rgba(0, 0, 0, 0.43)' }}
                >
                    계속 진행할 경우 API WIKI의 이용약관에 동의하고<br />
                    개인정보 처리 방침을 이해하는 것으로 간주됩니다.
                </div>
            </motion.div>
        </motion.div>
            )}
        </AnimatePresence>
    );
}
