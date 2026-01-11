// src/app/profile/page.tsx
'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Check, Loader2, Lock, Mail, Sparkles, User } from 'lucide-react';
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
            setFormData(prev => ({ ...prev, name: user.name || '' }));
            setOriginalName(user.name || '');
        }
    }, [user, originalName]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (isNameChanged && !isNameAvailable) {
            setError('닉네임 중복 확인을 해주세요');
            return;
        }

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
            const updatePayload: Record<string, string> = {};

            if (isNameChanged && isNameAvailable) {
                updatePayload.name = formData.name;
            }

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

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const canSubmit = () => {
        const hasPasswordChange = formData.password && formData.passwordConfirm && formData.password === formData.passwordConfirm;
        const hasNameChange = isNameChanged && isNameAvailable;
        return hasPasswordChange || hasNameChange;
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
                <div className="text-center">
                    <div
                        className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: 'var(--primary-blue)', borderTopColor: 'transparent' }}
                    ></div>
                    <p className="mt-4 text-[16px]" style={{ color: 'var(--text-gray)' }}>
                        로딩 중...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen"
            style={{ backgroundColor: 'var(--bg-light)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Header />

            <div className="bg-glow" />

            <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 space-y-6 relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Profile</p>
                        <h1 className="text-3xl font-semibold text-slate-900 mt-1">내 프로필</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
                    <motion.div
                        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-7"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                    >
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                            <div className="relative">
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#2196F3] to-[#0EA5E9] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center border border-gray-100">
                                    <Sparkles className="w-5 h-5 text-[#2196F3]" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-3 w-full">
                                <div className="flex items-center gap-2 text-slate-900 text-xl font-semibold">
                                    <User className="w-5 h-5 text-slate-500" />
                                    {user.name || '이름 없음'}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 text-[#0F172A] text-sm border border-blue-100">
                                        <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
                                        활동 점수 {user.activity_score ?? 0}점
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                            <div className="rounded-2xl border border-gray-100 bg-slate-50/60 px-4 py-3">
                                <p className="text-xs text-slate-500">현재 닉네임</p>
                                <p className="text-lg font-semibold text-slate-900 truncate">{user.name || '-'}</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-slate-50/60 px-4 py-3">
                                <p className="text-xs text-slate-500">활동 점수</p>
                                <p className="text-lg font-semibold text-[#0EA5E9]">{user.activity_score ?? 0}점</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-7"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-500">계정 설정</p>
                                <h2 className="text-xl font-semibold text-slate-900">닉네임 · 비밀번호</h2>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {message && (
                                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm">
                                    {message}
                                </motion.div>
                            )}
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm">
                                    {error}
                                </motion.div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-500" /> 닉네임
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="닉네임"
                                        className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/15 text-base text-slate-900"
                                    />
                                    {isNameChanged && (
                                        <button
                                            type="button"
                                            onClick={handleCheckName}
                                            disabled={isCheckingName}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-3 h-9 rounded-xl border border-[#2196F3] text-[#2196F3] text-sm font-medium bg-white hover:bg-blue-50 disabled:opacity-60"
                                        >
                                            {isCheckingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            {isCheckingName ? '확인 중' : '중복 확인'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-slate-500" /> 새 비밀번호
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="8자 이상 권장"
                                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/15 text-base text-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="passwordConfirm" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-slate-500" /> 새 비밀번호 확인
                                </label>
                                <input
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    type="password"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="한 번 더 입력"
                                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/15 text-base text-slate-900"
                                />
                            </div>

                            {canSubmit() && (
                                <motion.button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full h-12 rounded-xl bg-[#2196F3] text-white font-semibold shadow-md hover:bg-[#1b82d8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isSaving ? 1 : 1.01 }}
                                    whileTap={{ scale: isSaving ? 1 : 0.99 }}
                                >
                                    {isSaving
                                        ? '저장 중...'
                                        : isNameChanged && isNameAvailable && !formData.password
                                            ? '닉네임 변경'
                                            : formData.password && !isNameChanged
                                                ? '비밀번호 변경'
                                                : '변경사항 저장'}
                                </motion.button>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
