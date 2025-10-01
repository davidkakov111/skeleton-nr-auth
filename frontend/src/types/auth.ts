import type { JWTPayload } from "./api";

export interface AuthContextType {
  user: JWTPayload | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  loading: boolean;
}

export interface PasswordValidationResult {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  digit: boolean;
  specialChar: boolean;
}
