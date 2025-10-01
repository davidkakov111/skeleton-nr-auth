import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { NodeEnv } from "../types/env.js";

export const JWT_SECRET = process.env["JWT_SECRET"] || "supersecret";
const NODE_ENV = (process.env["NODE_ENV"] as NodeEnv) || "development";

// Create JWT token
export const createJWT = (
  id: number,
  email: string,
  role: string,
  createdAt: Date,
) => {
  return jwt.sign({ id, email, role, createdAt }, JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Helper to get consistent cookie options
const getCookieOptions = () => {
  const production = NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? ("none" as const) : ("lax" as const),
    maxAge: 1000 * 60 * 60 * 24,
  };
};

// Set JWT cookie on response
export const setJWTCookie = (res: Response, token: string) => {
  res.cookie("jwtToken", token, getCookieOptions());
};

// Clear JWT cookie on response
export const clearJWTCookie = (res: Response) => {
  res.clearCookie("jwtToken", getCookieOptions());
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  // There is some text before the @ (no spaces, no @)
  // There is some text after the @ (the domain)
  // There is at least one . in the domain part
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.toLowerCase());
};

// Validate password strength
export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters
  // At least 1 uppercase letter
  // At least 1 lowercase letter
  // At least 1 digit
  // At least 1 special character
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};
