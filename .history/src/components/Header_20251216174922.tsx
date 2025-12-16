// src/components/Header.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin, canSubmitAPI } from '@/lib/permissions';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import APIRegistrationModal from './APIRegistrationModal';

export default function Header() {
    const { user, isAuthenticated, signOut } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isAPIRegistrationModalOpen, setIsAPIRegistrationModalOpen] = useState(false);

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
            <header className="border-b border-gray-200 py-3 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a
                            href="/"
                            className="text-xl font-bold"
                            style={{
                                fontFamily: 'Orbitron, sans-serif',
                                background: 'linear-gradient(90deg, #81FFEF, #F067B4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            API WIKI
                        </a>
                        <a href="/about" className="text-sm text-gray-700 hover:text-gray-900">About Us</a>
                    </div>

                    <nav className="flex items-center gap-6">
                        <a href="/explore" className="text-sm text-gray-700 hover:text-gray-900">탐색</a>
                        <a href="/explore" className="text-sm text-gray-700 hover:text-gray-900">커뮤니티</a>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700">
                                    {user?.name}님 ({user?.grade})
                                </span>
                                <button
                                    onClick={signOut}
                                    className="px-5 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="px-5 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                            >
                                로그인
                            </button>
                        )}
                    </nav>
                </div>
            </header>

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
