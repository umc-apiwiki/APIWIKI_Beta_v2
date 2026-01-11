// src/lib/supabaseHelpers.ts
// Supabase 클라이언트 CRUD 헬퍼 함수

import { supabase } from './supabaseClient';
import type {
    User,
    API,
    Board,
    Comment,
    Feedback,
    UserActivity,
    WikiEdit,
    BoardType,
    ApiStatus,
    PaginatedResponse,
} from '@/types';

// ============================================
// 에러 처리 유틸리티
// ============================================

interface SupabaseError {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
}

/**
 * Supabase 에러를 처리하고 한국어 메시지로 변환
 */
function handleError(error: any, context: string): never {
    const errorMessage = error?.message || '알 수 없는 오류가 발생했습니다';
    console.error(`[Supabase Error] ${context}:`, {
        message: errorMessage,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
    });

    throw new Error(`${context} 실패: ${errorMessage}`);
}

// ============================================
// 제네릭 CRUD 함수
// ============================================

/**
 * 테이블의 모든 레코드 조회
 * @param table 테이블 이름
 * @param options 조회 옵션 (정렬, 필터 등)
 */
export async function getAll<T>(
    table: string,
    options?: {
        orderBy?: string;
        ascending?: boolean;
        limit?: number;
        offset?: number;
    }
): Promise<T[]> {
    try {
        let query = supabase.from(table).select('*');

        if (options?.orderBy) {
            query = query.order(options.orderBy, { ascending: options.ascending ?? true });
        }

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        if (options?.offset) {
            query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
        }

        const { data, error } = await query;

        if (error) {
            handleError(error, `${table} 테이블 전체 조회`);
        }

        return (data as T[]) || [];
    } catch (error) {
        handleError(error, `${table} 테이블 전체 조회`);
    }
}

/**
 * ID로 단일 레코드 조회
 * @param table 테이블 이름
 * @param id 레코드 ID
 */
export async function getById<T>(table: string, id: string): Promise<T | null> {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // 레코드가 없는 경우는 에러가 아님
            if (error.code === 'PGRST116') {
                return null;
            }
            handleError(error, `${table} 테이블 ID 조회`);
        }

        return data as T;
    } catch (error) {
        handleError(error, `${table} 테이블 ID 조회`);
    }
}

/**
 * 새 레코드 생성
 * @param table 테이블 이름
 * @param data 생성할 데이터
 */
export async function create<T>(table: string, data: Partial<T>): Promise<T> {
    try {
        const { data: newRecord, error } = await supabase
            .from(table)
            .insert(data)
            .select()
            .single();

        if (error) {
            handleError(error, `${table} 테이블 레코드 생성`);
        }

        console.log(`[Supabase] ${table} 레코드 생성 성공:`, newRecord);
        return newRecord as T;
    } catch (error) {
        handleError(error, `${table} 테이블 레코드 생성`);
    }
}

/**
 * 레코드 수정
 * @param table 테이블 이름
 * @param id 레코드 ID
 * @param data 수정할 데이터
 */
export async function update<T>(
    table: string,
    id: string,
    data: Partial<T>
): Promise<T> {
    try {
        const { data: updatedRecord, error } = await supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            handleError(error, `${table} 테이블 레코드 수정`);
        }

        console.log(`[Supabase] ${table} 레코드 수정 성공:`, updatedRecord);
        return updatedRecord as T;
    } catch (error) {
        handleError(error, `${table} 테이블 레코드 수정`);
    }
}

/**
 * 레코드 삭제
 * @param table 테이블 이름
 * @param id 레코드 ID
 */
export async function remove(table: string, id: string): Promise<void> {
    try {
        const { error } = await supabase.from(table).delete().eq('id', id);

        if (error) {
            handleError(error, `${table} 테이블 레코드 삭제`);
        }

        console.log(`[Supabase] ${table} 레코드 삭제 성공: ID ${id}`);
    } catch (error) {
        handleError(error, `${table} 테이블 레코드 삭제`);
    }
}

// ============================================
// User 관련 특화 함수
// ============================================

/**
 * 이메일로 사용자 조회
 * @param email 사용자 이메일
 */
export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const { data, error } = await supabase
            .from('User')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            handleError(error, '이메일로 사용자 조회');
        }

        return data as User;
    } catch (error) {
        handleError(error, '이메일로 사용자 조회');
    }
}

/**
 * 사용자 활동 점수 업데이트
 * @param userId 사용자 ID
 * @param points 추가할 점수
 */
export async function updateUserActivityScore(
    userId: string,
    points: number
): Promise<User> {
    try {
        // 현재 점수 조회
        const user = await getById<User>('User', userId);
        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다');
        }

        // 새 점수 계산
        const newScore = user.activity_score + points;

        // 점수 업데이트
        const updatedUser = await update<User>('User', userId, {
            activity_score: newScore,
        });

        console.log(`[Supabase] 사용자 활동 점수 업데이트: ${user.activity_score} -> ${newScore}`);
        return updatedUser;
    } catch (error) {
        handleError(error, '사용자 활동 점수 업데이트');
    }
}

// ============================================
// API 관련 특화 함수
// ============================================

/**
 * 사용자가 등록한 API 목록 조회
 * @param userId 사용자 ID
 */
export async function getUserAPIs(userId: string): Promise<API[]> {
    try {
        const { data, error } = await supabase
            .from('Api')
            .select('*')
            .eq('created_by', userId)
            .order('created_at', { ascending: false });

        if (error) {
            handleError(error, '사용자 등록 API 조회');
        }

        return (data as API[]) || [];
    } catch (error) {
        handleError(error, '사용자 등록 API 조회');
    }
}

/**
 * 승인 대기 중인 API 목록 조회
 */
export async function getPendingAPIs(): Promise<API[]> {
    try {
        const { data, error } = await supabase
            .from('Api')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            handleError(error, '승인 대기 API 조회');
        }

        return (data as API[]) || [];
    } catch (error) {
        handleError(error, '승인 대기 API 조회');
    }
}

/**
 * API 상태별 조회
 * @param status API 상태
 */
export async function getAPIsByStatus(status: ApiStatus): Promise<API[]> {
    try {
        const { data, error } = await supabase
            .from('Api')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) {
            handleError(error, `상태별 API 조회 (${status})`);
        }

        return (data as API[]) || [];
    } catch (error) {
        handleError(error, `상태별 API 조회 (${status})`);
    }
}

/**
 * API 승인 처리
 * @param apiId API ID
 * @param adminId 승인하는 관리자 ID
 */
export async function approveAPI(apiId: string, adminId: string): Promise<API> {
    try {
        const updatedAPI = await update<API>('Api', apiId, {
            status: 'approved',
            approved_by: adminId,
            approved_at: new Date().toISOString(),
        });

        console.log(`[Supabase] API 승인 완료: ${apiId}`);
        return updatedAPI;
    } catch (error) {
        handleError(error, 'API 승인 처리');
    }
}

// ============================================
// Board 관련 특화 함수
// ============================================

/**
 * 게시판 타입별 게시글 조회
 * @param type 게시판 타입
 * @param options 페이지네이션 옵션
 */
export async function getBoardsByType(
    type: BoardType,
    options?: { limit?: number; offset?: number }
): Promise<PaginatedResponse<Board>> {
    try {
        // 전체 개수 조회
        const { count, error: countError } = await supabase
            .from('boards')
            .select('*', { count: 'exact', head: true })
            .eq('type', type);

        if (countError) {
            handleError(countError, `게시판 타입별 조회 (${type}) - 개수`);
        }

        // 데이터 조회
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const { data, error } = await supabase
            .from('boards')
            .select('*')
            .eq('type', type)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            handleError(error, `게시판 타입별 조회 (${type})`);
        }

        return {
            data: (data as Board[]) || [],
            total: count || 0,
            page: Math.floor(offset / limit) + 1,
            pageSize: limit,
            hasMore: offset + limit < (count || 0),
        };
    } catch (error) {
        handleError(error, `게시판 타입별 조회 (${type})`);
    }
}

/**
 * 게시글의 댓글 조회
 * @param boardId 게시글 ID
 */
export async function getCommentsByBoardId(boardId: string): Promise<Comment[]> {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('board_id', boardId)
            .order('created_at', { ascending: true });

        if (error) {
            handleError(error, '게시글 댓글 조회');
        }

        return (data as Comment[]) || [];
    } catch (error) {
        handleError(error, '게시글 댓글 조회');
    }
}

// ============================================
// UserActivity 관련 특화 함수
// ============================================

/**
 * 사용자 활동 내역 조회
 * @param userId 사용자 ID
 * @param options 조회 옵션
 */
export async function getUserActivities(
    userId: string,
    options?: { limit?: number; offset?: number }
): Promise<UserActivity[]> {
    try {
        let query = supabase
            .from('user_activities')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        if (options?.offset) {
            query = query.range(
                options.offset,
                options.offset + (options.limit || 10) - 1
            );
        }

        const { data, error } = await query;

        if (error) {
            handleError(error, '사용자 활동 내역 조회');
        }

        return (data as UserActivity[]) || [];
    } catch (error) {
        handleError(error, '사용자 활동 내역 조회');
    }
}

// ============================================
// WikiEdit 관련 특화 함수
// ============================================

/**
 * API의 위키 편집 이력 조회
 * @param apiId API ID
 * @param options 조회 옵션
 */
export async function getWikiEditHistory(
    apiId: string,
    options?: { limit?: number; offset?: number }
): Promise<WikiEdit[]> {
    try {
        let query = supabase
            .from('wiki_edits')
            .select('*')
            .eq('api_id', apiId)
            .order('created_at', { ascending: false });

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        if (options?.offset) {
            query = query.range(
                options.offset,
                options.offset + (options.limit || 10) - 1
            );
        }

        const { data, error } = await query;

        if (error) {
            handleError(error, 'API 위키 편집 이력 조회');
        }

        return (data as WikiEdit[]) || [];
    } catch (error) {
        handleError(error, 'API 위키 편집 이력 조회');
    }
}

/**
 * 사용자의 위키 편집 이력 조회
 * @param userId 사용자 ID
 * @param options 조회 옵션
 */
export async function getUserWikiEdits(
    userId: string,
    options?: { limit?: number; offset?: number }
): Promise<WikiEdit[]> {
    try {
        let query = supabase
            .from('wiki_edits')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        if (options?.offset) {
            query = query.range(
                options.offset,
                options.offset + (options.limit || 10) - 1
            );
        }

        const { data, error } = await query;

        if (error) {
            handleError(error, '사용자 위키 편집 이력 조회');
        }

        return (data as WikiEdit[]) || [];
    } catch (error) {
        handleError(error, '사용자 위키 편집 이력 조회');
    }
}

// ============================================
// Feedback 관련 특화 함수
// ============================================

/**
 * 상태별 피드백 조회
 * @param status 피드백 상태 (선택사항, 없으면 전체 조회)
 */
export async function getFeedbackByStatus(
    status?: 'pending' | 'reviewed' | 'resolved'
): Promise<Feedback[]> {
    try {
        let query = supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            handleError(error, '상태별 피드백 조회');
        }

        return (data as Feedback[]) || [];
    } catch (error) {
        handleError(error, '상태별 피드백 조회');
    }
}
