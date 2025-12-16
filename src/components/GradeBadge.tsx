// src/components/GradeBadge.tsx
// 사용자 등급 배지 컴포넌트

'use client';

import React from 'react';
import { getGradeInfo } from '@/lib/gradeUtils';
import type { UserGrade } from '@/types';

// ============================================
// Props 타입
// ============================================

interface GradeBadgeProps {
    grade: UserGrade;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

// ============================================
// 크기별 스타일
// ============================================

const sizeStyles = {
    sm: {
        container: 'px-2 py-1 text-xs',
        icon: 'text-sm',
    },
    md: {
        container: 'px-3 py-1.5 text-sm',
        icon: 'text-base',
    },
    lg: {
        container: 'px-4 py-2 text-base',
        icon: 'text-lg',
    },
};

// ============================================
// 컴포넌트
// ============================================

export default function GradeBadge({
    grade,
    size = 'md',
    showLabel = true,
    className = '',
}: GradeBadgeProps) {
    const gradeInfo = getGradeInfo(grade);
    const styles = sizeStyles[size];

    return (
        <div
            className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${styles.container}
        ${className}
      `}
            style={{
                backgroundColor: `${gradeInfo.color}20`,
                color: gradeInfo.color,
                border: `2px solid ${gradeInfo.color}`,
            }}
            title={`${gradeInfo.name} 등급`}
        >
            <span className={styles.icon}>{gradeInfo.icon}</span>
            {showLabel && <span>{gradeInfo.name}</span>}
        </div>
    );
}

// ============================================
// 등급 배지 with 툴팁
// ============================================

interface GradeBadgeWithTooltipProps extends GradeBadgeProps {
    score: number;
    nextGradeScore?: number;
}

export function GradeBadgeWithTooltip({
    grade,
    score,
    nextGradeScore,
    size = 'md',
    showLabel = true,
    className = '',
}: GradeBadgeWithTooltipProps) {
    const gradeInfo = getGradeInfo(grade);
    const pointsToNext = nextGradeScore ? nextGradeScore - score : 0;

    return (
        <div className="relative group">
            <GradeBadge
                grade={grade}
                size={size}
                showLabel={showLabel}
                className={className}
            />

            {/* 툴팁 */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    <div className="font-semibold">{gradeInfo.name} 등급</div>
                    <div className="text-gray-300 mt-1">현재 점수: {score}점</div>
                    {gradeInfo.nextGrade && (
                        <div className="text-gray-300">
                            다음 등급까지: {pointsToNext}점
                        </div>
                    )}
                    {/* 화살표 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
