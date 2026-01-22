// src/hooks/useAuth.ts
'use client';

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import type { UserGrade } from '@/types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  grade: UserGrade;
  activity_score?: number;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        grade: session.user.grade,
        activity_score: session.user.activity_score,
      }
    : null;

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
  };
}
