// Business logic for auth

import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import type { User } from "../../generated/prisma/index.js";
import type { NodeEnv } from "../types/env.js";

const JWT_SECRET = process.env['JWT_SECRET'] || "supersecret";
const NODE_ENV = process.env['NODE_ENV'] as NodeEnv || "development";

// Create JWT token
const createJWT = (id: number, email: string, role: string, createdAt: Date) => {
    return jwt.sign(
        { id, email, role, createdAt },
        JWT_SECRET,
        { expiresIn: "24h" }
    );
}

// Helper to set JWT as HttpOnly cookie to response
const setJWTCookie = (res: Response, token: string) => {
    res.cookie("jwtToken", token, {
        httpOnly: true,                    // JS cannot read it
        secure: NODE_ENV === "production", // only over HTTPS
        sameSite: "none",                  // allow cross-site
        maxAge: 1000 * 60 * 60 * 24        // 24 hours in milliseconds
    });
}

// Regiester the user if not exists and return JWT cookie
export const register = async (req: Request, res: Response): Promise<void>  => {
    const { email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword }
        });

        const token = createJWT(newUser.id, newUser.email, newUser.role, newUser.createdAt);

        setJWTCookie(res, token);
        res.status(201).json({ message: "User registered", user: { id: newUser.id, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt } });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login user and return JWT cookie
export const login = async (req: Request, res: Response) => {
    // Passport populates req.user after local strategy succeeds
    const user = req.user as User;
    const token = createJWT(user.id, user.email, user.role, user.createdAt);
   
    setJWTCookie(res, token);
    res.json({ message: "Logged in", user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt } });
};

// Logout user by clearing the JWT cookie
export const logout = (_req: Request, res: Response) => {
    res.clearCookie("jwtToken", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "none",
    });
    res.json({ message: "Logged out" });
};

// Status route using verifyJWT middleware
export const status = (req: Request, res: Response) => {
    if (!req.jwtUser) {
        res.status(401).json({ message: "Not authenticated" });
    } else {
        res.json({user: req.jwtUser});
    }
};
