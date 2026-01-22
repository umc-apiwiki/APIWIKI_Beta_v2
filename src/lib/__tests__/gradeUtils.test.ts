// src/lib/__tests__/gradeUtils.test.ts
// 등급 계산 유틸리티 테스트

import { describe, it, expect } from 'vitest';
import {
  calculateGrade,
  getGradeInfo,
  getActivityPoints,
  getPointsToNextGrade,
  getGradeProgress,
  canEditWiki,
  compareGrades,
  isGradeUpgrade,
} from '../gradeUtils';

describe('Grade Calculation Utils', () => {
  describe('calculateGrade', () => {
    it('브론즈: 0-99점', () => {
      expect(calculateGrade(0)).toBe('bronze');
      expect(calculateGrade(50)).toBe('bronze');
      expect(calculateGrade(99)).toBe('bronze');
    });

    it('실버: 100-499점', () => {
      expect(calculateGrade(100)).toBe('silver');
      expect(calculateGrade(250)).toBe('silver');
      expect(calculateGrade(499)).toBe('silver');
    });

    it('골드: 500점 이상', () => {
      expect(calculateGrade(500)).toBe('gold');
      expect(calculateGrade(1000)).toBe('gold');
      expect(calculateGrade(10000)).toBe('gold');
    });
  });

  describe('getGradeInfo', () => {
    it('브론즈 정보 반환', () => {
      const info = getGradeInfo('bronze');
      expect(info.grade).toBe('bronze');
      expect(info.name).toBe('브론즈');
      expect(info.icon).toBe('🥉');
      expect(info.nextGrade).toBe('silver');
      expect(info.nextGradeScore).toBe(100);
    });

    it('실버 정보 반환', () => {
      const info = getGradeInfo('silver');
      expect(info.grade).toBe('silver');
      expect(info.name).toBe('실버');
      expect(info.icon).toBe('🥈');
      expect(info.nextGrade).toBe('gold');
      expect(info.nextGradeScore).toBe(500);
    });

    it('골드 정보 반환 (다음 등급 없음)', () => {
      const info = getGradeInfo('gold');
      expect(info.grade).toBe('gold');
      expect(info.name).toBe('골드');
      expect(info.icon).toBe('🥇');
      expect(info.nextGrade).toBeUndefined();
      expect(info.nextGradeScore).toBeUndefined();
    });
  });

  describe('getActivityPoints', () => {
    it('활동 타입별 점수 반환', () => {
      expect(getActivityPoints('login')).toBe(1);
      expect(getActivityPoints('post')).toBe(2);
      expect(getActivityPoints('comment')).toBe(1);
      expect(getActivityPoints('edit')).toBe(4);
      expect(getActivityPoints('feedback')).toBe(3);
      expect(getActivityPoints('api_approval')).toBe(5);
      expect(getActivityPoints('csv_upload')).toBe(5);
      expect(getActivityPoints('csv_update')).toBe(2);
    });
  });

  describe('getPointsToNextGrade', () => {
    it('브론즈에서 실버까지 필요한 점수', () => {
      expect(getPointsToNextGrade(0, 'bronze')).toBe(100);
      expect(getPointsToNextGrade(50, 'bronze')).toBe(50);
      expect(getPointsToNextGrade(99, 'bronze')).toBe(1);
    });

    it('실버에서 골드까지 필요한 점수', () => {
      expect(getPointsToNextGrade(100, 'silver')).toBe(400);
      expect(getPointsToNextGrade(300, 'silver')).toBe(200);
      expect(getPointsToNextGrade(499, 'silver')).toBe(1);
    });

    it('골드는 다음 등급 없음 (0 반환)', () => {
      expect(getPointsToNextGrade(500, 'gold')).toBe(0);
      expect(getPointsToNextGrade(1000, 'gold')).toBe(0);
    });
  });

  describe('getGradeProgress', () => {
    it('브론즈 진행률 계산', () => {
      expect(getGradeProgress(0, 'bronze')).toBe(0);
      expect(getGradeProgress(50, 'bronze')).toBe(50);
      expect(getGradeProgress(99, 'bronze')).toBe(99);
    });

    it('실버 진행률 계산', () => {
      expect(getGradeProgress(100, 'silver')).toBe(0);
      expect(getGradeProgress(300, 'silver')).toBe(50);
      expect(getGradeProgress(499, 'silver')).toBeCloseTo(99.75, 1);
    });

    it('골드는 항상 100%', () => {
      expect(getGradeProgress(500, 'gold')).toBe(100);
      expect(getGradeProgress(1000, 'gold')).toBe(100);
    });
  });

  describe('canEditWiki', () => {
    it('브론즈: 50자 또는 10%', () => {
      const result1 = canEditWiki('bronze', 1000, 50);
      expect(result1.canEdit).toBe(true);

      const result2 = canEditWiki('bronze', 1000, 100); // 10%
      expect(result2.canEdit).toBe(true);

      const result3 = canEditWiki('bronze', 1000, 150);
      expect(result3.canEdit).toBe(false);
      expect(result3.reason).toContain('브론즈');
    });

    it('실버: 100자 또는 20%', () => {
      const result1 = canEditWiki('silver', 1000, 100);
      expect(result1.canEdit).toBe(true);

      const result2 = canEditWiki('silver', 1000, 200); // 20%
      expect(result2.canEdit).toBe(true);

      const result3 = canEditWiki('silver', 1000, 250);
      expect(result3.canEdit).toBe(false);
    });

    it('골드: 200자 또는 30%', () => {
      const result1 = canEditWiki('gold', 1000, 200);
      expect(result1.canEdit).toBe(true);

      const result2 = canEditWiki('gold', 1000, 300); // 30%
      expect(result2.canEdit).toBe(true);

      const result3 = canEditWiki('gold', 1000, 350);
      expect(result3.canEdit).toBe(false);
    });

    it('관리자: 무제한', () => {
      const result = canEditWiki('admin', 1000, 10000);
      expect(result.canEdit).toBe(true);
    });
  });

  describe('compareGrades', () => {
    it('등급 비교', () => {
      expect(compareGrades('bronze', 'silver')).toBe(-1);
      expect(compareGrades('silver', 'bronze')).toBe(1);
      expect(compareGrades('bronze', 'bronze')).toBe(0);
      expect(compareGrades('gold', 'silver')).toBe(1);
      expect(compareGrades('admin', 'gold')).toBe(1);
    });
  });

  describe('isGradeUpgrade', () => {
    it('업그레이드 확인', () => {
      expect(isGradeUpgrade('bronze', 'silver')).toBe(true);
      expect(isGradeUpgrade('silver', 'gold')).toBe(true);
      expect(isGradeUpgrade('bronze', 'bronze')).toBe(false);
      expect(isGradeUpgrade('silver', 'bronze')).toBe(false);
    });
  });
});
