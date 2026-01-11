// src/lib/apiService.ts
// Supabase에서 API 데이터를 조회하는 서비스 함수들

import { supabase } from './supabaseClient';
import type { API } from '@/types';

/**
 * 승인된 API 목록 조회
 */
export async function getApprovedAPIs(limit?: number): Promise<API[]> {
    let query = supabase
        .from('Api')
        .select('*, logo')
        .eq('status', 'approved')
        .order('createdAt', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('승인된 API 목록 조회 실패:', error);
        return [];
    }

    return data || [];
}

/**
 * 인기 API 조회 (viewsLast7Days 기준)
 */
export async function getPopularAPIs(limit: number = 10): Promise<API[]> {
    const { data, error } = await supabase
        .from('Api')
        .select('*, logo')
        .eq('status', 'approved')
        .order('viewsLast7Days', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('인기 API 조회 실패:', error);
        return [];
    }

    return data || [];
}

/**
 * 카테고리별 API 조회
 */
export async function getAPIsByCategory(category: string, limit?: number): Promise<API[]> {
    let query = supabase
        .from('Api')
        .select('*, logo')
        .eq('status', 'approved')
        .contains('categories', [category])
        .order('rating', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error(`카테고리 "${category}" API 조회 실패:`, error);
        return [];
    }

    return data || [];
}

/**
 * API 상세 조회
 */
export async function getAPIById(id: string): Promise<API | null> {
    const { data, error } = await supabase
        .from('Api')
        .select('*, logo')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`API ID "${id}" 조회 실패:`, error);
        return null;
    }

    return data;
}

/**
 * 관련 API 조회
 */
export async function getRelatedAPIs(relatedIds: string[]): Promise<API[]> {
    if (!relatedIds || relatedIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from('Api')
        .select('*, logo')
        .in('id', relatedIds)
        .eq('status', 'approved');

    if (error) {
        console.error('관련 API 조회 실패:', error);
        return [];
    }

    return data || [];
}

/**
 * API 검색 및 필터링
 */
export interface SearchFilters {
    category?: string;
    price?: 'free' | 'paid' | 'mixed';
    minRating?: number;
    query?: string;
}

export async function searchAPIs(
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
): Promise<{ data: API[]; total: number }> {
    let query = supabase
        .from('Api')
        .select('*, logo', { count: 'exact' })
        .eq('status', 'approved');

    // 카테고리 필터
    if (filters.category) {
        query = query.contains('categories', [filters.category]);
    }

    // 가격 필터
    if (filters.price) {
        query = query.eq('price', filters.price);
    }

    // 최소 평점 필터
    if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
    }

    // 검색어 (이름 또는 설명에서 검색)
    if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    // 페이지네이션
    const offset = (page - 1) * limit;
    query = query
        .order('rating', { ascending: false })
        .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
        console.error('API 검색 실패:', error);
        return { data: [], total: 0 };
    }

    return {
        data: data || [],
        total: count || 0,
    };
}

/**
 * 모든 카테고리 조회
 */
export async function getAllCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('Api')
        .select('categories')
        .eq('status', 'approved');

    if (error) {
        console.error('카테고리 조회 실패:', error);
        return [];
    }

    // 모든 카테고리를 중복 제거하여 반환
    const allCategories = data?.flatMap(api => api.categories || []) || [];
    return Array.from(new Set(allCategories)).sort();
}
