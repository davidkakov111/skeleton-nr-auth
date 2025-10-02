import prisma from "../config/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createJWT, setJWTCookie, validateEmail, validatePassword } from "../utils/auth.js";

// Update user email by jwt
export const updateUserEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get user by jwt
    const currentUser = req.jwtUser;
    if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    
    // Validate email
    const { email } = req.body;
    if (!validateEmail(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
    }
    const existing = await prisma.user.findUnique({where: { email }});
    if (existing && existing.id !== currentUser.id) {
        res.status(400).json({ message: "Email already in use" });
        return;
    }

    // Update email in db
    const updatedUsr = await prisma.user.update({
        where: { id: currentUser.id },
        data: { email },
    });

    // Update email in JWT cookie
    const token = createJWT(
        updatedUsr.id,
        updatedUsr.email,
        updatedUsr.role,
        updatedUsr.createdAt,
    );
    setJWTCookie(res, token);

    res.json({ message: "Success" });
  } catch (err) {
    console.error("Error in updateUserEmail controller: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user password by jwt
export const updateUserPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { newPassword, currentPassword } = req.body;

    // Get user by jwt
    const jwtUser = req.jwtUser;
    if (!jwtUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    const user = await prisma.user.findUnique({ where: { id: jwtUser.id }, select: { password: true } });
    
    // Ensure the provided current password is correct
    if (user?.password) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({
                message: "Invalid current password",
            });
            return;
        }
    }

    // Validate new password format and hash it
    if (!validatePassword(newPassword)) {
        res.status(400).json({
            message: "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.",
        });
        return;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in db
    await prisma.user.update({
        where: { id: jwtUser.id },
        data: { password: hashedNewPassword },
    });

    res.json({ message: "Success" });
  } catch (err) {
    console.error("Error in updateUserPassword controller: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
