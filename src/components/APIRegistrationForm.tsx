// src/components/APIRegistrationForm.tsx
'use client';

import { useState } from 'react';
import type { APISubmissionPayload } from '@/types';

interface APIRegistrationFormProps {
    onSubmit: (data: APISubmissionPayload) => Promise<void>;
    onCancel: () => void;
}

const CATEGORIES = [
    '지도', '위치', '결제', '금융', '이메일', '알림', '통신',
    'AI', '번역', '미디어', 'SNS', '소셜로그인', '인증', '보안',
    '스토리지', '클라우드', '데이터', '분석', '검색', '개발도구',
    '생산성', '협업', '마케팅', 'CRM', '이커머스', '날씨', '기타'
];

export default function APIRegistrationForm({ onSubmit, onCancel }: APIRegistrationFormProps) {
    const [formData, setFormData] = useState<APISubmissionPayload>({
        name: '',
        company: '',
        description: '',
        categories: [],
        price: 'free',
        logo: '',
        features: [],
        pricing: {},
    });
    const [featureInput, setFeatureInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryToggle = (category: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index) || []
        }));
    };

    const handlePricingChange = (tier: 'free' | 'basic' | 'pro', value: string) => {
        setFormData(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                [tier]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 유효성 검사
        if (!formData.name.trim()) {
            setError('API 이름을 입력해주세요');
            return;
        }
        if (!formData.company.trim()) {
            setError('회사명을 입력해주세요');
            return;
        }
        if (!formData.description.trim()) {
            setError('설명을 입력해주세요');
            return;
        }
        if (formData.categories.length === 0) {
            setError('최소 1개의 카테고리를 선택해주세요');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'API 등록 중 오류가 발생했습니다');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* 기본 정보 */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        API 이름 *
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="예: Google Maps API"
                    />
                </div>

                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        회사명 *
                    </label>
                    <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="예: Google"
                    />
                </div>

                <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                        로고 (이모지)
                    </label>
                    <input
                        id="logo"
                        name="logo"
                        type="text"
                        value={formData.logo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="예: 🗺️"
                        maxLength={2}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        설명 *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="API에 대한 간단한 설명을 입력하세요"
                    />
                </div>
            </div>

            {/* 카테고리 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 * (최소 1개 선택)
                </label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => handleCategoryToggle(category)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.categories.includes(category)
                                    ? 'bg-teal-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* 가격 정책 */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    가격 정책 *
                </label>
                <select
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                    <option value="free">무료</option>
                    <option value="paid">유료</option>
                    <option value="mixed">혼합 (무료/유료)</option>
                </select>
            </div>

            {/* 가격 상세 - CSV 형식 */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">가격 상세 (선택사항)</h4>
                <p className="text-xs text-gray-500">
                    각 플랜을 쉼표(,)로 구분하여 입력하세요. 예: 무료 플랜 설명, 기본 플랜 설명, 프로 플랜 설명
                </p>

                <div>
                    <label htmlFor="pricing-csv" className="block text-xs text-gray-600 mb-1">
                        가격 플랜 (CSV)
                    </label>
                    <textarea
                        id="pricing-csv"
                        value={formData.pricing?.csv || ''}
                        onChange={(e) => handlePricingChange('csv' as any, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        placeholder="예: 월 1,000건 무료, 월 $10 - 10,000건, 월 $100 - 100,000건"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        쉼표로 구분된 각 항목이 하나의 플랜으로 표시됩니다
                    </p>
                </div>
            </div>

            {/* 주요 기능 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    주요 기능 (선택사항)
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="기능을 입력하고 추가 버튼을 클릭하세요"
                    />
                    <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        추가
                    </button>
                </div>
                {formData.features && formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                                {feature}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="text-blue-700 hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? '등록 중...' : 'API 등록'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                    취소
                </button>
            </div>
        </form>
    );
}
