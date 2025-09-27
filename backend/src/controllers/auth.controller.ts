// Business logic for auth

import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import type { User } from "../../generated/prisma/index.js";

const JWT_SECRET = process.env['JWT_SECRET'] || "supersecret";

// Create JWT token
const createJWT = (id: number, role: string) => {
    return jwt.sign(
        { id, role },
        JWT_SECRET,
        { expiresIn: "24h" }
    );
}

// Regiester the user if not exists and return JWT
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

        const token = createJWT(newUser.id, newUser.role);

        res.status(201).json({ message: "User registered", token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login user and return JWT
export const login = async (req: Request, res: Response) => {
    // Passport populates req.user after local strategy succeeds
    const user = req.user as User;
    
    const token = createJWT(user.id, user.role);
    res.json({ token });
};
