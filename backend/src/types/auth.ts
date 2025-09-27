export type UserRole = 'admin' | 'user';

export type JWTPayload = { id: number; role: UserRole };
