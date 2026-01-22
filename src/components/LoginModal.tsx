// src/components/LoginModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './LoginModal.module.css';

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
    password: '',
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
            className={styles.modalContainer}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleClose}>
              <svg
                className={styles.closeIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className={styles.logoSection}>
              <img src="/logo.svg" alt="API Wiki" className={styles.logo} />
              <h2 className={styles.logoText}>API Wiki</h2>
            </div>

            <form onSubmit={handleCredentialsLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="email"
                  placeholder="아이디"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isLoading}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={isLoading}
                />
              </div>

              {loginError && <p className={styles.errorText}>{loginError}</p>}

              <button type="submit" disabled={isLoading} className={styles.loginButton}>
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className={styles.linkSection}>
              <button className={styles.linkButton}>아이디 찾기</button>
              <div className={styles.divider}></div>
              <button className={styles.linkButton}>비밀번호 찾기</button>
              <div className={styles.divider}></div>
              <button onClick={onSwitchToSignup} className={styles.linkButton}>
                회원가입
              </button>
            </div>

            <div className={styles.socialSection}>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={styles.socialButton}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="G"
                  className={styles.socialIcon}
                />
                <span className={styles.socialText}>Sign up with Google</span>
              </button>
              <button disabled={true} className={styles.socialButton}>
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GH"
                  className={styles.socialIcon}
                />
                <span className={styles.socialText}>Sign up with Github</span>
              </button>
            </div>

            <div className={styles.termsText}>
              계속 진행할 경우 API WIKI의 이용약관에 동의하고
              <br />
              개인정보 처리 방침을 이해하는 것으로 간주됩니다.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
