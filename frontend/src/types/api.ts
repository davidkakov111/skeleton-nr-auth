import type { USER_ROLES } from "../api/auth";

export type UserRole = typeof USER_ROLES[number];
export type JWTPayload = {
  id: number;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export type ApiError = { response?: { data?: { message?: string }, status: number } };
