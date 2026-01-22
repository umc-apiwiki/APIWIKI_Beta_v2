// src/components/mobile/MobileBottomNavigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Compass, MessageCircle, User } from 'lucide-react';
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
    { icon: Home, href: '/', id: 'home', onClick: null },
    { icon: Compass, href: '/explore', id: 'explore', onClick: null },
    { icon: MessageCircle, href: '/boards/community', id: 'community', onClick: null },
    { icon: User, href: '/profile', id: 'profile', onClick: handleProfileClick }
  ];

  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          {navItems.map(({ icon: Icon, href, id, onClick }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            
            if (onClick) {
              // 프로필은 버튼으로 처리
              return (
                <button
                  key={id}
                  onClick={onClick}
                  className={styles.navItem}
                >
                  <div className={styles.iconWrapper}>
                    <Icon 
                      size={24} 
                      className={`${styles.icon} ${isActive ? styles.iconActive : styles.iconInactive}`}
                      strokeWidth={2}
                      fill="none"
                    />
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={id}
                href={href}
                className={styles.navItem}
              >
                <div className={styles.iconWrapper}>
                  <Icon 
                    size={24} 
                    className={`${styles.icon} ${isActive ? styles.iconActive : styles.iconInactive}`}
                    strokeWidth={2}
                    fill={isActive && id === 'home' ? 'currentColor' : 'none'}
                  />
                </div>
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
