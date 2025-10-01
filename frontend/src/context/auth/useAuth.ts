import { createContext, useContext } from "react";
import type { AuthContextType } from "../../types/auth";

// Create AuthContext with default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
