import type { JWTPayload, UserRole } from "../types/api";
import { api } from "./axios";

// Get all users (for admins)
export const allUsers = () => {
  return api.get<{ users: JWTPayload[] }>("/admin/users");
};

// Update user role (for admins)
export const updateUserRole = (userId: number, role: UserRole) => {
  return api.put<{ message: string }>("/admin/update-user-role", {
    userId,
    role,
  });
};
