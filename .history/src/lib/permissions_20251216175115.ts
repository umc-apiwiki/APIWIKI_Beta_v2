// src/lib/permissions.ts
import type { UserGrade } from '@/types';
import type { AuthUser } from '@/hooks/useAuth';

/**
 * 사용자가 관리자인지 확인
 */
export function isAdmin(user: AuthUser | null | undefined): boolean {
    return user?.grade === 'admin';
}

/**
 * 사용자가 API를 등록할 수 있는지 확인
 * 현재는 로그인한 모든 사용자가 등록 가능
 */
export function canSubmitAPI(user: AuthUser | null | undefined): boolean {
    return !!user;
}

/**
 * 사용자가 위키를 편집할 수 있는지 확인
 * 등급별 편집 권한 체크
 */
export function canEditWiki(user: AuthUser | null | undefined): boolean {
    return !!user; // 로그인한 사용자만 편집 가능
}

/**
 * 등급별 최대 편집 가능 글자 수 반환
 */
export function getMaxEditChars(grade: UserGrade): number {
    switch (grade) {
        case 'bronze':
            return 50;
        case 'silver':
            return 100;
        case 'gold':
            return 200;
        case 'admin':
            return Infinity;
        default:
            return 0;
    }
}

/**
 * 등급별 최대 편집 가능 비율 반환 (0.1 = 10%)
 */
export function getMaxEditPercentage(grade: UserGrade): number {
    switch (grade) {
        case 'bronze':
            return 0.1; // 10%
        case 'silver':
            return 0.2; // 20%
        case 'gold':
            return 0.3; // 30%
        case 'admin':
            return 1.0; // 100%
        default:
            return 0;
    }
}
