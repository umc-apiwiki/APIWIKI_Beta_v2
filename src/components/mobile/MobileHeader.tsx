// src/components/mobile/MobileHeader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '../LoginModal';
import SignupModal from '../SignupModal';

export default function MobileHeader() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?q=${encodeURIComponent(searchQuery)}`;
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image 
                src="/logo.svg" 
                alt="API Wiki Logo" 
                fill
                className="object-contain"
                priority 
              />
            </div>
            <span className="text-lg font-bold text-blue-600">API WIKI</span>
          </Link>

          {/* 오른쪽 아이콘 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search size={22} className="text-gray-700" />
            </button>

            {isAuthenticated ? (
              <>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <Bell size={22} className="text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        </div>

        {/* 메뉴 드롭다운 */}
        <AnimatePresence>
          {isMenuOpen && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-2">
                <div className="text-sm font-medium text-gray-900">{user?.email}</div>
                <div className="text-xs text-blue-600">포인트: {user?.activity_score ?? 0}</div>
                <div className="pt-2 border-t border-gray-200 space-y-1">
                  <Link
                    href="/profile"
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    내 프로필
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 검색 오버레이 */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[60] md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* 검색 헤더 */}
              <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-200">
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={22} />
                </button>
                <form onSubmit={handleSearch} className="flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="API 검색..."
                    className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </form>
              </div>

              {/* 검색 결과 영역 */}
              <div className="flex-1 overflow-y-auto p-4">
                {searchQuery ? (
                  <div className="text-gray-500 text-sm">
                    &apos;{searchQuery}&apos; 검색 결과
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    API 이름이나 키워드를 입력하세요
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
