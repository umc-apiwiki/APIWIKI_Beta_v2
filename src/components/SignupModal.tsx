// src/components/SignupModal.tsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import styles from './LoginModal.module.css';

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
                        className={styles.modalContainer}
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                         <button
                            className={styles.closeButton}
                            onClick={handleClose}
                        >
                             <svg className={styles.closeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                         <div className={styles.logoSection}>
                            <img src="/logo.svg" alt="API Wiki" className={styles.logo} />
                            <h2 className={styles.logoText}>API Wiki</h2>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="닉네임"
                                className={styles.input}
                                disabled={isLoading}
                            />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="이메일"
                                className={styles.input}
                                disabled={isLoading}
                            />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="비밀번호"
                                className={styles.input}
                                disabled={isLoading}
                            />
                             <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="비밀번호 확인"
                                className={styles.input}
                                disabled={isLoading}
                            />
                            </div>

                            {error && (
                                <p className={styles.errorText}>{error}</p>
                            )}

                             <button
                                type="submit"
                                disabled={isLoading}
                                className={styles.loginButton}
                            >
                                {isLoading ? '회원가입' : '회원가입'}
                            </button>
                        </form>

                        <div className={styles.linkSection}>
                           <span>이미 계정이 있으신가요?</span>
                            <button onClick={onSwitchToLogin} className={styles.linkButton}>로그인</button>
                        </div>
                        
                         <div className={styles.termsText}>
                             계속 진행할 경우 API WIKI의 이용약관에 동의하고<br/>
                             개인정보 처리 방침을 이해하는 것으로 간주됩니다.
                         </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
