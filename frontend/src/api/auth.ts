import type { JWTPayload } from "../types/api";
import { api } from "./axios";

export const USER_ROLES = ['admin', 'user'] as const;

// Register user
export const register = (email: string, password: string) => {
  return api.post<{ message: string, user: JWTPayload }>('/auth/register', { email, password });
};

// Login user
export const login = (email: string, password: string) => {
  return api.post<{ message: string, user: JWTPayload }>('/auth/login', { email, password });
};

// Logout user
export const logout = () => {
  return api.post<{ message: string }>('/auth/logout');
};

// Get user status
export const status = () => {
  return api.get<{ user: JWTPayload }>('/auth/status');
};
