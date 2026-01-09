// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        password: '',
        passwordConfirm: '',
    });
    const [originalName, setOriginalName] = useState('');
    const [isCheckingName, setIsCheckingName] = useState(false);
    const [isNameAvailable, setIsNameAvailable] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (user && !originalName) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
            }));
            setOriginalName(user.name || '');
        }
    }, [user, originalName]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // 닉네임이 변경되면 중복 확인 상태 초기화
        if (name === 'name') {
            setIsNameAvailable(false);
            setMessage('');
            setError('');
        }
    };

    const isNameChanged = formData.name !== originalName && formData.name.trim() !== '';

    const handleCheckName = async () => {
        if (!formData.name.trim() || formData.name === originalName) {
            return;
        }

        setIsCheckingName(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`/api/user/check-name?name=${encodeURIComponent(formData.name)}`, {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok && result.available) {
                setIsNameAvailable(true);
                setMessage('사용 가능한 닉네임입니다');
                setError('');
            } else {
                setIsNameAvailable(false);
                setError(result.error || '이미 사용 중인 닉네임입니다');
                setMessage('');
            }
        } catch (err: any) {
            setError('닉네임 확인 중 오류가 발생했습니다');
            setMessage('');
        } finally {
            setIsCheckingName(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // 닉네임이 변경되었는데 중복 확인을 안 한 경우
        if (isNameChanged && !isNameAvailable) {
            setError('닉네임 중복 확인을 해주세요');
            return;
        }

        // 비밀번호 변경 시 확인
        if (formData.password || formData.passwordConfirm) {
            if (formData.password !== formData.passwordConfirm) {
                setError('비밀번호가 일치하지 않습니다');
                return;
            }
            if (formData.password.length < 6) {
                setError('비밀번호는 최소 6자 이상이어야 합니다');
                return;
            }
        }

        setIsSaving(true);
        try {
            const updatePayload: any = {};

            // 닉네임이 변경되었고 중복 확인을 통과한 경우
            if (isNameChanged && isNameAvailable) {
                updatePayload.name = formData.name;
            }

            // 비밀번호가 입력된 경우
            if (formData.password) {
                updatePayload.password = formData.password;
            }

            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatePayload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '프로필 업데이트에 실패했습니다');
            }

            setMessage('프로필이 성공적으로 업데이트되었습니다');
            setFormData(prev => ({ ...prev, password: '', passwordConfirm: '' }));
            setOriginalName(formData.name);
            setIsNameAvailable(false);

            // 2초 후 새로고침하여 변경사항 반영
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary-blue)', borderTopColor: 'transparent' }}></div>
                    <p className="mt-4 text-[16px]" style={{ color: 'var(--text-gray)' }}>로딩 중...</p>
                </div>
            </div>
        );
    }

    const canSubmit = () => {
        const hasPasswordChange = formData.password && formData.passwordConfirm && formData.password === formData.passwordConfirm;
        const hasNameChange = isNameChanged && isNameAvailable;
        return hasPasswordChange || hasNameChange;
    };

    return (
        <motion.div
            className="min-h-screen"
            style={{ backgroundColor: 'var(--bg-light)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Header />

            {/* 배경 그라데이션 */}
            <div className="bg-glow" />

            <div className="grid-container pt-32 pb-20 relative z-10">
                <div className="col-12 max-w-2xl mx-auto">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-[32px] font-medium tracking-widest mb-12 text-center" style={{ color: 'var(--text-dark)' }}>
                            Profile
                        </h1>

                        {/* 프로필 이미지 */}
                        <div className="flex flex-col items-center mb-16">
                            <div className="relative">
                                <div className="w-48 h-48 rounded-full border border-[#2196F3] flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-[#2196F3] to-[#00BCD4] flex items-center justify-center text-white font-bold text-7xl">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <button className="absolute bottom-2 right-2 w-10 h-10 bg-black rounded-full shadow-lg flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* 메시지 */}
                        <div className="max-w-md mx-auto mb-4">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg"
                                    style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7' }}
                                >
                                    <p className="text-sm" style={{ color: '#065f46' }}>{message}</p>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg"
                                    style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                                >
                                    <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
                                </motion.div>
                            )}
                        </div>

                        {/* 프로필 폼 */}
                        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                            {/* 닉네임 */}
                            <div className="relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="닉네임"
                                    className="w-full h-11 px-6 bg-white rounded-[30px] border border-zinc-200 focus:outline-none focus:border-[#2196F3] transition-all text-base"
                                    style={{
                                        boxShadow: '0px 3px 5px 0px rgba(224, 224, 233, 0.25)',
                                        color: 'var(--text-dark)'
                                    }}
                                />
                                {isNameChanged && (
                                    <button
                                        type="button"
                                        onClick={handleCheckName}
                                        disabled={isCheckingName}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-4 bg-white rounded-2xl border border-[#2196F3] text-[#2196F3] text-sm font-medium transition-colors hover:bg-blue-50 disabled:opacity-50"
                                        style={{ boxShadow: '0px 1px 2px 0px rgba(33, 150, 243, 0.25)' }}
                                    >
                                        {isCheckingName ? '확인 중...' : '중복 확인'}
                                    </button>
                                )}
                            </div>

                            {/* 비밀번호 */}
                            <div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="비밀번호"
                                    className="w-full h-11 px-6 bg-white rounded-[30px] border border-zinc-200 focus:outline-none focus:border-[#2196F3] transition-all text-base"
                                    style={{
                                        boxShadow: '0px 3px 5px 0px rgba(224, 224, 233, 0.25)',
                                        color: 'var(--text-dark)'
                                    }}
                                />
                            </div>

                            {/* 비밀번호 확인 */}
                            <div>
                                <input
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    type="password"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="비밀번호 확인"
                                    className="w-full h-11 px-6 bg-white rounded-[30px] border border-zinc-200 focus:outline-none focus:border-[#2196F3] transition-all text-base"
                                    style={{
                                        boxShadow: '0px 3px 5px 0px rgba(224, 224, 233, 0.25)',
                                        color: 'var(--text-dark)'
                                    }}
                                />
                            </div>

                            {/* 저장 버튼 */}
                            {canSubmit() && (
                                <motion.button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full h-14 bg-[#2196F3] text-white font-medium rounded-[30px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                                    style={{
                                        boxShadow: '0px 3px 5px 0px rgba(224, 224, 233, 0.25)',
                                    }}
                                    whileHover={{ scale: isSaving ? 1 : 1.02 }}
                                    whileTap={{ scale: isSaving ? 1 : 0.98 }}
                                >
                                    {isSaving ? '저장 중...' : (isNameChanged && isNameAvailable && !formData.password) ? '닉네임 변경' : (formData.password && !isNameChanged) ? '비밀번호 변경' : '변경사항 저장'}
                                </motion.button>
                            )}

                            {/* 회원 탈퇴 */}
                            <div className="pt-8">
                                <button
                                    type="button"
                                    className="w-full h-14 bg-slate-50 rounded-[30px] border border-zinc-200 text-zinc-400 text-lg font-normal transition-colors hover:bg-gray-100"
                                    style={{
                                        boxShadow: '0px 3px 5px 0px rgba(224, 224, 233, 0.25)',
                                    }}
                                >
                                    회원 탈퇴
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
