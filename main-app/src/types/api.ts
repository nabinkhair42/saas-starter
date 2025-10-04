import {
  AuthenticatedUser,
  SocialAccountUrl,
  UserLocation,
  UserProfile,
  UserSession,
} from '@/types/user';

export interface ApiErrorResponse {
  message?: string;
}

export type ApiError = Error & {
  response?: {
    status?: number;
    data?: ApiErrorResponse;
  };
};

// Authentication API interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
    session?: SessionSummary;
    user: AuthenticatedUser;
  };
}

export interface CreateAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface SessionSummary {
  sessionId: string;
  createdAt: string;
  browser: string;
  os: string;
  device: string;
  ipAddress: string;
}

export interface AuthResponse {
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      isVerified: boolean;
    };
  };
}

// User Management API interfaces
export interface UpdateUserDetailsRequest {
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  socialAccounts?: SocialAccountUrl[];
  preferences?: {
    theme?: string;
    font?: string;
  };
  dob?: Date;
  location?: Partial<UserLocation> | null;
}

export interface ChangeUsernameRequest {
  username: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteUserRequest {
  password?: string;
}

export interface UserDetailsResponse {
  message: string;
  data: {
    user: UserProfile;
  };
}

export interface UserSessionsResponse {
  message: string;
  data: {
    sessions: UserSession[];
  };
}

export interface RevokeSessionRequest {
  sessionId: string;
}

export interface AvatarUploadResponse {
  message: string;
  data?: {
    avatar: string;
  };
}
