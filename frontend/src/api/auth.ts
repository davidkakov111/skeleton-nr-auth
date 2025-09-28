import axios, { type AxiosResponse } from "axios";
import type { JWTPayload } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Register user and return JWT
export const register = (email: string, password: string): Promise<AxiosResponse<{ message: string, user: JWTPayload }>> => {
  return axios.post(`${API_URL}/auth/register`, { email, password });
};

// Login user and return JWT
export const login = (email: string, password: string): Promise<AxiosResponse<{ message: string, user: JWTPayload }>> => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};

// Logout user server-side based on JWT in cookie
export const logout = (): Promise<AxiosResponse<{ message: string }>> => {
  return axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
};

// Get user status based on JWT in cookie
export const status = (): Promise<AxiosResponse<{ user: JWTPayload }>> => {
  return axios.get(`${API_URL}/auth/status`, { withCredentials: true });
};
