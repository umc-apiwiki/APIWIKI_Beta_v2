// src/lib/gradeUtils.ts
// 사용자 등급 계산 및 관리 유틸리티

import type { UserGrade, ActivityType } from '@/types';

// ============================================
// 상수 정의
// ============================================

/** 등급별 점수 기준 */
export const GRADE_THRESHOLDS = {
    bronze: { min: 0, max: 99, name: '브론즈', color: '#CD7F32', icon: '🥉' },
    silver: { min: 100, max: 499, name: '실버', color: '#C0C0C0', icon: '🥈' },
    gold: { min: 500, max: Infinity, name: '골드', color: '#FFD700', icon: '🥇' },
    admin: { min: 0, max: Infinity, name: '관리자', color: '#9333EA', icon: '👑' },
} as const;

/** 활동 타입별 점수 */
export const ACTIVITY_POINTS: Record<ActivityType, number> = {
    login: 1,
    post: 5,
    comment: 2,
    edit: 3,
};

/** 등급별 위키 편집 권한 */
export const EDIT_PERMISSIONS = {
    bronze: { maxChars: 50, maxPercent: 10 },
    silver: { maxChars: 100, maxPercent: 20 },
    gold: { maxChars: 200, maxPercent: 30 },
    admin: { maxChars: Infinity, maxPercent: 100 },
} as const;

// ============================================
// 타입 정의
// ============================================

export interface GradeInfo {
    grade: UserGrade;
    name: string;
    color: string;
    icon: string;
    minScore: number;
    maxScore: number;
    nextGrade?: UserGrade;
    nextGradeScore?: number;
}

export interface EditPermission {
    canEdit: boolean;
    maxChars: number;
    maxPercent: number;
    reason?: string;
}

// ============================================
// 등급 계산 함수
// ============================================

/**
 * 점수를 기반으로 사용자 등급 계산
 * @param score 활동 점수
 * @returns 계산된 등급
 */
export function calculateGrade(score: number): UserGrade {
    if (score >= GRADE_THRESHOLDS.gold.min) {
        return 'gold';
    } else if (score >= GRADE_THRESHOLDS.silver.min) {
        return 'silver';
    } else {
        return 'bronze';
    }
}

/**
 * 등급 정보 조회
 * @param grade 사용자 등급
 * @returns 등급 상세 정보
 */
export function getGradeInfo(grade: UserGrade): GradeInfo {
    const threshold = GRADE_THRESHOLDS[grade];

    // 다음 등급 정보 계산
    let nextGrade: UserGrade | undefined;
    let nextGradeScore: number | undefined;

    if (grade === 'bronze') {
        nextGrade = 'silver';
        nextGradeScore = GRADE_THRESHOLDS.silver.min;
    } else if (grade === 'silver') {
        nextGrade = 'gold';
        nextGradeScore = GRADE_THRESHOLDS.gold.min;
    }
    // gold와 admin은 다음 등급 없음

    return {
        grade,
        name: threshold.name,
        color: threshold.color,
        icon: threshold.icon,
        minScore: threshold.min,
        maxScore: threshold.max,
        nextGrade,
        nextGradeScore,
    };
}

/**
 * 활동 타입별 점수 반환
 * @param actionType 활동 타입
 * @returns 해당 활동의 점수
 */
export function getActivityPoints(actionType: ActivityType): number {
    return ACTIVITY_POINTS[actionType];
}

/**
 * 다음 등급까지 필요한 점수 계산
 * @param currentScore 현재 점수
 * @param currentGrade 현재 등급
 * @returns 다음 등급까지 필요한 점수 (최고 등급이면 0)
 */
export function getPointsToNextGrade(
    currentScore: number,
    currentGrade: UserGrade
): number {
    const gradeInfo = getGradeInfo(currentGrade);

    if (!gradeInfo.nextGradeScore) {
        return 0; // 이미 최고 등급
    }

    return Math.max(0, gradeInfo.nextGradeScore - currentScore);
}

/**
 * 등급 진행률 계산 (0-100)
 * @param currentScore 현재 점수
 * @param currentGrade 현재 등급
 * @returns 현재 등급 내에서의 진행률 (%)
 */
export function getGradeProgress(
    currentScore: number,
    currentGrade: UserGrade
): number {
    const gradeInfo = getGradeInfo(currentGrade);

    // 최고 등급이면 100%
    if (!gradeInfo.nextGradeScore) {
        return 100;
    }

    const rangeStart = gradeInfo.minScore;
    const rangeEnd = gradeInfo.nextGradeScore;
    const rangeSize = rangeEnd - rangeStart;
    const currentProgress = currentScore - rangeStart;

    return Math.min(100, Math.max(0, (currentProgress / rangeSize) * 100));
}

// ============================================
// 위키 편집 권한 함수
// ============================================

/**
 * 위키 편집 권한 확인
 * @param grade 사용자 등급
 * @param contentLength 전체 문서 길이
 * @param editLength 편집하려는 길이 (선택사항)
 * @returns 편집 권한 정보
 */
export function canEditWiki(
    grade: UserGrade,
    contentLength: number,
    editLength?: number
): EditPermission {
    const permission = EDIT_PERMISSIONS[grade];

    // 관리자는 무제한
    if (grade === 'admin') {
        return {
            canEdit: true,
            maxChars: permission.maxChars,
            maxPercent: permission.maxPercent,
        };
    }

    const maxByChars = permission.maxChars;
    const maxByPercent = Math.floor((contentLength * permission.maxPercent) / 100);
    const actualMax = Math.max(maxByChars, maxByPercent);

    // 편집 길이가 제공되지 않으면 권한 정보만 반환
    if (editLength === undefined) {
        return {
            canEdit: true,
            maxChars: maxByChars,
            maxPercent: permission.maxPercent,
        };
    }

    // 편집 길이 확인
    if (editLength > actualMax) {
        return {
            canEdit: false,
            maxChars: maxByChars,
            maxPercent: permission.maxPercent,
            reason: `${grade} 등급은 최대 ${maxByChars}자 또는 전체의 ${permission.maxPercent}%까지 편집 가능합니다.`,
        };
    }

    return {
        canEdit: true,
        maxChars: maxByChars,
        maxPercent: permission.maxPercent,
    };
}

/**
 * 등급별 편집 가능한 최대 글자 수 계산
 * @param grade 사용자 등급
 * @param contentLength 전체 문서 길이
 * @returns 편집 가능한 최대 글자 수
 */
export function getMaxEditLength(grade: UserGrade, contentLength: number): number {
    const permission = EDIT_PERMISSIONS[grade];

    if (grade === 'admin') {
        return Infinity;
    }

    const maxByChars = permission.maxChars;
    const maxByPercent = Math.floor((contentLength * permission.maxPercent) / 100);

    return Math.max(maxByChars, maxByPercent);
}

// ============================================
// 등급 비교 함수
// ============================================

/**
 * 두 등급 비교
 * @param grade1 첫 번째 등급
 * @param grade2 두 번째 등급
 * @returns grade1이 더 높으면 1, 같으면 0, 낮으면 -1
 */
export function compareGrades(grade1: UserGrade, grade2: UserGrade): number {
    const order: Record<UserGrade, number> = {
        bronze: 0,
        silver: 1,
        gold: 2,
        admin: 3,
    };

    return Math.sign(order[grade1] - order[grade2]);
}

/**
 * 등급 업그레이드 여부 확인
 * @param oldGrade 이전 등급
 * @param newGrade 새 등급
 * @returns 업그레이드 여부
 */
export function isGradeUpgrade(oldGrade: UserGrade, newGrade: UserGrade): boolean {
    return compareGrades(newGrade, oldGrade) > 0;
}
