// Business logic for auth

import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { clearJWTCookie, createJWT, setJWTCookie, validateEmail, validatePassword } from "../utils/auth.js";

// Regiester the user if not exists and return JWT cookie
export const register = async (req: Request, res: Response): Promise<void>  => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!validateEmail(email)) {
            res.status(400).json({ message: "Invalid email format" });
            return;
        } else if (!validatePassword(password)) {
            res.status(400).json({ message: "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character." });
            return;
        }

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
        console.error('Error in register controller: ', err);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout user by clearing the JWT cookie
export const logout = (_req: Request, res: Response) => {
    clearJWTCookie(res);
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
