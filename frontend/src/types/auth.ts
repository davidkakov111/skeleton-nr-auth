import type { JWTPayload } from "./api";

export interface AuthContextType {
    user: JWTPayload | null;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshStatus: () => Promise<void>;
}