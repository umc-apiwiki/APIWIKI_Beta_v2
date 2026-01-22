// src/components/Header.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin, canSubmitAPI } from '@/lib/permissions';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import APIRegistrationModal from './APIRegistrationModal';
import styles from './Header.module.css';

interface HeaderProps {
  transparent?: boolean;
  className?: string;
}

export default function Header({ transparent = false, className = '' }: HeaderProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAPIRegistrationModalOpen, setIsAPIRegistrationModalOpen] = useState(false);
  const totalPoints = user?.activity_score ?? 0;

  // Dropdown state logic
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <nav
        className={`${styles.header} fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'var(--grid-gutter)',
          padding: '1.25rem var(--grid-margin)',
          alignItems: 'center',
          backgroundColor: transparent ? 'transparent' : 'rgba(249, 251, 254, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {/* Logo Area - 3 columns */}
        <a
          href="/"
          className="flex items-center gap-3 text-[1.5625rem] font-normal cursor-pointer select-none"
          style={{
            gridColumn: 'span 3',
            color: 'var(--primary-blue)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <Image
            src="/logo.svg"
            alt="API Wiki Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
            draggable={false}
          />
          <span>API Wiki</span>
        </a>

        {/* Nav Links - 6 columns */}
        <div
          className="flex justify-center gap-10 select-none"
          style={{
            gridColumn: 'span 6',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <a
            href="/boards/community"
            className="text-xl font-medium transition-colors whitespace-nowrap"
            style={{ color: '#0D3C61' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-blue)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0D3C61')}
          >
            Community
          </a>
          <a
            href="/explore"
            className="text-xl font-medium transition-colors whitespace-nowrap"
            style={{ color: '#0D3C61' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-blue)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0D3C61')}
          >
            Explore
          </a>
          <a
            href="/about"
            className="text-xl font-medium transition-colors whitespace-nowrap"
            style={{ color: '#0D3C61' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-blue)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0D3C61')}
          >
            About Us
          </a>
        </div>

        {/* Login/User Area - 3 columns */}
        <div
          className="flex items-center justify-end gap-4 select-none"
          style={{
            gridColumn: 'span 3',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {isAuthenticated ? (
            <div className="flex items-center gap-2" ref={dropdownRef}>
              <span className="text-sm text-gray-600 leading-none">
                {totalPoints.toLocaleString()} P
              </span>
              <div className="relative group">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2196F3] to-[#00BCD4] flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2"
                      style={{ zIndex: 1001 }}
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        {canSubmitAPI(user) && (
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setIsAPIRegistrationModalOpen(true);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2196F3] transition-colors flex items-center gap-2"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 5v14" />
                              <path d="M5 12h14" />
                            </svg>
                            API 등록
                          </button>
                        )}

                        <a
                          href="/profile"
                          className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2196F3] transition-colors flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          내 프로필
                        </a>
                        <a
                          href="/history"
                          className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2196F3] transition-colors flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          활동 내역
                        </a>

                        {isAdmin(user) && (
                          <a
                            href="/admin"
                            className="px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors flex items-center gap-2 font-medium"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="7" height="7" />
                              <rect x="14" y="3" width="7" height="7" />
                              <rect x="14" y="14" width="7" height="7" />
                              <rect x="3" y="14" width="7" height="7" />
                            </svg>
                            관리자 페이지
                          </a>
                        )}

                        <div className="border-t border-gray-50 my-1"></div>

                        <button
                          onClick={() => signOut()}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          로그아웃
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <motion.button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xl font-semibold cursor-pointer"
              style={{ color: '#0D3C61' }}
              whileHover={{
                scale: 1.05,
                color: 'var(--primary-blue)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Login
            </motion.button>
          )}
        </div>
      </nav>

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

      <APIRegistrationModal
        isOpen={isAPIRegistrationModalOpen}
        onClose={() => setIsAPIRegistrationModalOpen(false)}
      />
    </>
  );
}
