import { ApiResponse } from './api-response.model';

export enum Role {
  ROLE_FREELANCER = 'ROLE_FREELANCER',
  ROLE_UNDERWRITER = 'ROLE_UNDERWRITER',
  ROLE_ASSESSOR = 'ROLE_ASSESSOR',
  ROLE_ADMIN = 'ROLE_ADMIN',
  FREELANCER = 'FREELANCER',
  UNDERWRITER = 'UNDERWRITER',
  ASSESSOR = 'ASSESSOR',
  ADMIN = 'ADMIN'
}

export type UserRole =
  | 'ROLE_FREELANCER'
  | 'ROLE_UNDERWRITER'
  | 'ROLE_ASSESSOR'
  | 'ROLE_ADMIN'
  | 'FREELANCER'
  | 'UNDERWRITER'
  | 'ASSESSOR'
  | 'ADMIN';

export interface User {
  id?: number;
  userId?: number;
  name: string;
  email: string;
  role: Role | UserRole | string;
  phone?: string;
  profession?: string;
  experienceYears?: number;
  city?: string;
  averageMonthlyIncome?: number;
  kycVerified?: boolean;
  active?: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profession?: string;
  experienceYears?: number;
  city?: string;
  averageMonthlyIncome?: number;
  role?: Role | UserRole | string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
  role: Role | UserRole | string;
  profession?: string;
}

export type { ApiResponse };
