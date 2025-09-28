export type UserRole = 'admin' | 'user';

export type JWTPayload = { id: number; email: string; role: UserRole; createdAt: Date };
