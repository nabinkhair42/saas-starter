import type { AuthenticatedUser } from '@/types/user';

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface SessionData {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  isGuest: boolean;
  status: SessionStatus;
}
