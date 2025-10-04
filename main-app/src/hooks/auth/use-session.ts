'use client';

import { useAuth } from '@/providers/auth-provider';
import type { SessionData } from '@/types/session';

/**
 * Hook to access session information
 * This is a simple wrapper around useAuth for cleaner API
 */
export const useSession = (): SessionData => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
    // Helper computed properties
    isLoggedIn: isAuthenticated,
    isGuest: !isAuthenticated,
    status: isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated',
  };
};
