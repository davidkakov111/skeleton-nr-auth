import prisma, { USER_ROLES } from "../config/db.js";
import type { Request, Response } from "express";
import { createJWT, setJWTCookie } from "../utils/auth.js";

// Return all users
export const getAllUsers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });
    res.json({ users });
  } catch (err) {
    console.error("Error in getAllUsers controller: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role by id
export const updateUserRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get admin user by jwt
    const jwtUser = req.jwtUser;
    if (!jwtUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    // Validate input
    const { userId, role } = req.body;
    if (!userId || !role) {
      res.status(400).json({ message: "userId and role are required" });
      return;
    }
    if (!USER_ROLES.includes(role)) {
      res
        .status(400)
        .json({ message: `Role should be one of: ${USER_ROLES.join(", ")}` });
      return;
    }

    // Update role if user exists
    const result = await prisma.user.updateMany({
      where: { id: Number(userId) },
      data: { role },
    });
    if (result.count === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // If we updated our role, then update our jwt cookie accordingly
    if (Number(userId) === jwtUser.id) {
      const token = createJWT(jwtUser.id, jwtUser.email, role, jwtUser.createdAt);
      setJWTCookie(res, token);
    }

    res.json({ message: "Success" });
  } catch (err) {
    console.error("Error in updateUserRole controller: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
