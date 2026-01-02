// src/components/Header.tsx
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin, canSubmitAPI } from '@/lib/permissions';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import APIRegistrationModal from './APIRegistrationModal';

interface HeaderProps {
    transparent?: boolean;
    className?: string;
}

export default function Header({ transparent = false, className = '' }: HeaderProps) {
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
            <nav 
                className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${className}`}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: 'var(--grid-gutter)',
                    padding: '20px var(--grid-margin)',
                    alignItems: 'center',
                    backgroundColor: transparent ? 'transparent' : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                }}
            >
                {/* Logo Area - 3 columns */}
                <a 
                    href="/"
                    className="flex items-center gap-3 text-[25px] font-normal cursor-pointer select-none"
                    style={{ 
                        gridColumn: 'span 3',
                        color: 'var(--primary-blue)',
                        userSelect: 'none',
                        WebkitUserSelect: 'none'
                    }}
                >
                    <img 
                        src="/logo.svg" 
                        alt="API Wiki Logo" 
                        className="h-[40px] w-auto"
                        draggable="false"
                    />
                    <span>API Wiki</span>
                </a>

                {/* Nav Links - 6 columns */}
                <div 
                    className="flex justify-center gap-10 select-none"
                    style={{ 
                        gridColumn: 'span 6',
                        userSelect: 'none',
                        WebkitUserSelect: 'none'
                    }}
                >
                    <a 
                        href="/boards/community" 
                        className="text-[20px] font-medium transition-colors whitespace-nowrap"
                        style={{ color: 'var(--text-gray)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-gray)'}
                    >
                        Community
                    </a>
                    <a 
                        href="/explore" 
                        className="text-[20px] font-medium transition-colors whitespace-nowrap"
                        style={{ color: 'var(--text-gray)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-gray)'}
                    >
                        Explore
                    </a>
                    <a 
                        href="/about" 
                        className="text-[20px] font-medium transition-colors whitespace-nowrap"
                        style={{ color: 'var(--text-gray)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-gray)'}
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
                        WebkitUserSelect: 'none'
                    }}
                >
                    {isAuthenticated ? (
                        <>
                            {canSubmitAPI(user) && (
                                <button
                                    onClick={() => setIsAPIRegistrationModalOpen(true)}
                                    className="text-[16px] font-medium transition-colors"
                                    style={{ color: 'var(--text-gray)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-gray)'}
                                >
                                    API 등록
                                </button>
                            )}
                            {isAdmin(user) && (
                                <a 
                                    href="/admin" 
                                    className="text-[16px] font-medium transition-colors"
                                    style={{ color: 'var(--text-gray)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-gray)'}
                                >
                                    관리자
                                </a>
                            )}
                            <span className="text-[16px]" style={{ color: 'var(--text-gray)' }}>
                                {user?.name}
                            </span>
                            <button
                                onClick={signOut}
                                className="text-[20px] font-semibold cursor-pointer transition-colors"
                                style={{ color: 'var(--text-gray)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-gray)'}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <motion.button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="text-[20px] font-semibold cursor-pointer"
                            style={{ color: 'var(--text-gray)' }}
                            whileHover={{ 
                                scale: 1.05,
                                color: 'var(--primary-blue)'
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
