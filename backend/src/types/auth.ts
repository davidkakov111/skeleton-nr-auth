import type { USER_ROLES } from "../config/db.js";

export type UserRole = typeof USER_ROLES[number];

export type JWTPayload = { id: number; email: string; role: UserRole; createdAt: Date };
