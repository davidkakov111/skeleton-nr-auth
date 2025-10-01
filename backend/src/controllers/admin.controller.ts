import prisma, { USER_ROLES } from "../config/db.js";
import type { Request, Response } from "express";

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

    res.json({ message: "Success" });
  } catch (err) {
    console.error("Error in updateUserRole controller: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
