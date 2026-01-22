// src/components/mobile/MobileBottomNavigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';
import styles from './MobileBottomNavigation.module.css';

export default function MobileBottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAuthenticated) {
      // 로그인 되어 있으면 프로필 페이지로 이동
      router.push('/profile');
    } else {
      // 로그인 안 되어 있으면 로그인 모달 표시
      setIsLoginModalOpen(true);
    }
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const navItems = [
    {
      id: 'home',
      href: '/',
      svg: (color: string) => (
        <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
          <path
            d="M11.2897 2.25763C11.7671 1.85176 12.3734 1.62891 13 1.62891C13.6266 1.62891 14.2329 1.85176 14.7103 2.25763L22.6322 8.99082C22.9238 9.2387 23.158 9.547 23.3186 9.89436C23.4793 10.2417 23.5625 10.6199 23.5625 11.0026V21.5326C23.5625 22.0713 23.3485 22.5879 22.9676 22.9689C22.5866 23.3498 22.07 23.5638 21.5313 23.5638H18.2813C17.7425 23.5638 17.2259 23.3498 16.8449 22.9689C16.464 22.5879 16.25 22.0713 16.25 21.5326V16.2513C16.25 15.8216 16.0798 15.4094 15.7766 15.1049C15.4735 14.8003 15.062 14.6283 14.6323 14.6263H11.3669C10.9373 14.6285 10.5261 14.8006 10.2231 15.1051C9.92008 15.4096 9.75 15.8217 9.75 16.2513V21.5326C9.75 21.7993 9.69746 22.0635 9.59538 22.3099C9.4933 22.5563 9.34368 22.7803 9.15506 22.9689C8.96644 23.1575 8.74252 23.3071 8.49608 23.4092C8.24963 23.5113 7.9855 23.5638 7.71875 23.5638H4.46875C3.93003 23.5638 3.41337 23.3498 3.03244 22.9689C2.65151 22.5879 2.4375 22.0713 2.4375 21.5326V11.0026C2.43752 10.6199 2.52073 10.2417 2.68137 9.89436C2.842 9.547 3.07623 9.2387 3.36781 8.99082L11.2897 2.25763Z"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
      onClick: null,
    },
    {
      id: 'explore',
      href: '/explore',
      svg: (color: string) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
          <path d="M16 16L21 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      onClick: null,
    },
    {
      id: 'community',
      href: '/boards/community',
      svg: (color: string) => (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path
            d="M9.33301 24V22.6667C9.33301 20.8986 10.0354 19.2029 11.2856 17.9526C12.5359 16.7024 14.2316 16 15.9997 16M15.9997 16C17.7678 16 19.4635 16.7024 20.7137 17.9526C21.964 19.2029 22.6663 20.8986 22.6663 22.6667V24M15.9997 16C17.0605 16 18.078 15.5786 18.8281 14.8284C19.5782 14.0783 19.9997 13.0609 19.9997 12C19.9997 10.9391 19.5782 9.92172 18.8281 9.17157C18.078 8.42143 17.0605 8 15.9997 8C14.9388 8 13.9214 8.42143 13.1712 9.17157C12.4211 9.92172 11.9997 10.9391 11.9997 12C11.9997 13.0609 12.4211 14.0783 13.1712 14.8284C13.9214 15.5786 14.9388 16 15.9997 16ZM1.33301 24V22.6667C1.33301 21.6058 1.75444 20.5884 2.50458 19.8382C3.25473 19.0881 4.27214 18.6667 5.33301 18.6667M5.33301 18.6667C6.04025 18.6667 6.71853 18.3857 7.21863 17.8856C7.71872 17.3855 7.99967 16.7072 7.99967 16C7.99967 15.2928 7.71872 14.6145 7.21863 14.1144C6.71853 13.6143 6.04025 13.3333 5.33301 13.3333C4.62576 13.3333 3.94749 13.6143 3.44739 14.1144C2.94729 14.6145 2.66634 15.2928 2.66634 16C2.66634 16.7072 2.94729 17.3855 3.44739 17.8856C3.94749 18.3857 4.62576 18.6667 5.33301 18.6667ZM30.6663 24V22.6667C30.6663 21.6058 30.2449 20.5884 29.4948 19.8382C28.7446 19.0881 27.7272 18.6667 26.6663 18.6667M26.6663 18.6667C27.3736 18.6667 28.0519 18.3857 28.552 17.8856C29.0521 17.3855 29.333 16.7072 29.333 16C29.333 15.2928 29.0521 14.6145 28.552 14.1144C28.0519 13.6143 27.3736 13.3333 26.6663 13.3333C25.9591 13.3333 25.2808 13.6143 24.7807 14.1144C24.2806 14.6145 23.9997 15.2928 23.9997 16C23.9997 16.7072 24.2806 17.3855 24.7807 17.8856C25.2808 18.3857 25.9591 18.6667 26.6663 18.6667Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      onClick: null,
    },
    {
      id: 'profile',
      href: '/profile',
      svg: (color: string) => (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path
            d="M14.5146 19.4014H17.4844C21.857 19.4014 25.3993 22.9438 25.3994 27.3164C25.3994 27.584 25.1826 27.8015 24.915 27.8018H7.08496C6.81725 27.8018 6.59961 27.5841 6.59961 27.3164C6.59969 22.9438 10.142 19.4014 14.5146 19.4014ZM16 4.60156C18.7625 4.60177 21 6.83898 21 9.60156C21 12.3641 18.7625 14.6014 16 14.6016C13.2373 14.6016 11 12.3643 11 9.60156C11 6.83885 13.2373 4.60156 16 4.60156Z"
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      ),
      onClick: handleProfileClick,
    },
  ];

  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          {navItems.map(({ svg, href, id, onClick }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            const iconColor = isActive ? '#2196F3' : '#000000';

            if (onClick) {
              return (
                <button key={id} onClick={onClick} className={styles.navItem}>
                  <div className={styles.iconWrapper}>{svg(iconColor)}</div>
                </button>
              );
            }

            return (
              <Link key={id} href={href} className={styles.navItem}>
                <div className={styles.iconWrapper}>{svg(iconColor)}</div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 로그인/회원가입 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}
