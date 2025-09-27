// JWT verification middlewares

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JWTPayload, UserRole } from "../types/auth.js";

const JWT_SECRET = process.env['JWT_SECRET'] || "supersecret";

// Extend Express Request type to include `jwtUser`
declare global {
    namespace Express {
        interface Request {
            jwtUser?: JWTPayload;
        }
    }
}

// Middleware to verify JWT and attach user info to request
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ message: "No jwt token provided" });
        return;
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
        res.status(401).json({ message: "Invalid token format, use 'Bearer <token>' format" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.jwtUser = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired jwt token" });
    }
};

// Optional: role-based authorization middleware (provide multiple roles who can access)
export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.jwtUser || !roles.includes(req.jwtUser.role)) {
            res.status(403).json({ message: "Forbidden: insufficient role" });
        } else {
            next();
        }
    };
};
