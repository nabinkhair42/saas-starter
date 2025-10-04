import type { ApiError } from '@/types/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getApiErrorMessage = (error: ApiError, fallback: string) => {
  return error.response?.data?.message ?? fallback;
};
