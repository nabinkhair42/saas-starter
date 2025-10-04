'use client';

import { setLastUsedProviderCookie } from '@/hooks/auth/use-last-used-provider';
import { getApiErrorMessage } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { authService } from '@/services/auth-service';
import type { ApiError } from '@/types/api';
import {
  CreateAccountRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
} from '@/types/api';
import { AuthMethod } from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Login mutation
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      return toast.promise(authService.login(data), {
        loading: 'Logging in',
        success: response => response.message,
        error: (error: ApiError) =>
          getApiErrorMessage(error, 'Unable to log in. Please try again.'),
      });
    },
    onSuccess: response => {
      const { accessToken, refreshToken, user, session } = response.data;
      login(accessToken, refreshToken, user, {
        sessionId: session?.sessionId,
      });
      // Set email as the last used authentication method
      setLastUsedProviderCookie(AuthMethod.EMAIL);
    },
    onError: (error: ApiError) => {
      toast.error(getApiErrorMessage(error, 'Unable to log in right now. Please try again later.'));
    },
  });
};

// Create account mutation
export const useCreateAccount = () => {
  return useMutation({
    mutationFn: async (data: CreateAccountRequest) => {
      return toast.promise(authService.createAccount(data), {
        loading: 'Creating account',
        success: response => response.message,
        error: (error: ApiError) =>
          getApiErrorMessage(error, 'Unable to create account right now. Please try again later.'),
      });
    },
    onError: (error: ApiError) => {
      toast.error(
        getApiErrorMessage(error, 'Unable to create account right now. Please try again later.')
      );
    },
  });
};

// Email verification mutation
export const useVerifyEmail = (onSuccessCallback?: () => void) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: EmailVerificationRequest) => {
      return toast.promise(authService.verifyEmail(data), {
        loading: 'Verifying email...',
        success: response => response.message,
        error: (error: ApiError) =>
          getApiErrorMessage(error, 'Unable to verify email right now. Please try again later.'),
      });
    },
    onSuccess: response => {
      const { accessToken, refreshToken, user, session } = response.data;
      login(accessToken, refreshToken, user, {
        sessionId: session?.sessionId,
      });
      // Set email as the last used authentication method
      setLastUsedProviderCookie(AuthMethod.EMAIL);
      // Call the callback after auth state is updated
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: ApiError) => {
      toast.error(
        getApiErrorMessage(error, 'Unable to verify email right now. Please try again later.')
      );
    },
  });
};

// Resend verification mutation
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return toast.promise(authService.resendVerification(email), {
        loading: 'Sending verification email',
        success: response => response.message,
        error: (error: ApiError) =>
          getApiErrorMessage(error, 'Unable to send verification email. Please try again later.'),
      });
    },
    onError: (error: ApiError) => {
      toast.error(
        getApiErrorMessage(error, 'Unable to send verification email. Please try again later.')
      );
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      return toast.promise(authService.forgotPassword(data), {
        loading: 'Sending password reset email',
        success: response => response.message,
        error: (error: ApiError) =>
          getApiErrorMessage(error, 'Unable to send password reset email. Please try again later.'),
      });
    },
    onError: (error: ApiError) => {
      toast.error(
        getApiErrorMessage(error, 'Unable to send password reset email. Please try again later.')
      );
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      return toast.promise(authService.resetPassword(data), {
        loading: 'Resetting password',
        success: response => response.message,
        error: (error: ApiError) =>
          getApiErrorMessage(error, 'Unable to reset password right now. Please try again later.'),
      });
    },
    onError: (error: ApiError) => {
      toast.error(
        getApiErrorMessage(error, 'Unable to reset password right now. Please try again later.')
      );
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return toast.promise(authService.logout(), {
        loading: 'Logging out...',
        success: response => response.message,
        error: (error: ApiError) =>
          getApiErrorMessage(error, 'Unable to log out right now. Please try again later.'),
      });
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached queries
    },
    onError: (error: ApiError) => {
      // Even if logout API fails, we should still clear local state
      logout();
      queryClient.clear();
      toast.error(
        getApiErrorMessage(error, 'Unable to log out right now. Please try again later.')
      );
    },
  });
};
