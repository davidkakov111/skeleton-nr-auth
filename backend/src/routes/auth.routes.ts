import { Router, type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import { register, login, logout, status } from "../controllers/auth.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.js";
import type { IVerifyOptions } from "passport-local";
import type { User } from "../../generated/prisma/index.js";

const router = Router();

router.post("/register", register);

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        "local",
        { session: false },
        (err: Error | null, user: User | false, info?: IVerifyOptions) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: info?.message || "Unauthorized" });

            req.user = user; // attach user to request
            next(); // call login controller
        }
    )(req, res, next);
}, login);

router.post("/logout", logout);

router.get("/status", verifyJWT, status);

// Example route with authorizeRoles middleware:
router.get("/me/admin-info", verifyJWT, authorizeRoles("admin"), (_req: Request, res: Response) => {
  res.json({ message: "Extra admin-only info for your profile" });
});

export default router;
