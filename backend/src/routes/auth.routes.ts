import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import passport from "passport";
import { register, logout, status } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.js";
import type { IVerifyOptions } from "passport-local";
import type { User } from "../../generated/prisma/index.js";
import { createJWT, setJWTCookie } from "../utils/auth.js";

const router = Router();

// ---------- email & password ---------------
router.post("/register", register);

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error | null, user: User | false, info?: IVerifyOptions) => {
      if (err) {
        return res
          .status(500)
          .json({ message: err.message || "Internal server error" });
      }

      if (!user)
        return res
          .status(401)
          .json({ message: info?.message || "Unauthorized" });

      const token = createJWT(user.id, user.email, user.role, user.createdAt);
      setJWTCookie(res, token);

      return res.json({
        message: "Logged in",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    },
  )(req, res, next);
});
// ---------- email & password ---------------

// ---------- Google ---------------
// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Handle callback from Google
router.get("/google/callback", (req: Request, res: Response, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    // Redirect to frontend with error message
    if (err) {
      const message = encodeURIComponent(err.message || "Google login failed");
      return res.redirect(
        `${process.env["FRONTEND_URL"]}/login?error=${message}`,
      );
    }
    if (!user) {
      return res.redirect(
        `${process.env["FRONTEND_URL"]}/login?error=No user found`,
      );
    }

    // Success → set JWT cookie
    const token = createJWT(user.id, user.email, user.role, user.createdAt);
    setJWTCookie(res, token);

    // Redirect to frontend with cookie
    res.redirect(process.env["FRONTEND_URL"] || "");
  })(req, res, next);
});

// ---------- Google ---------------

router.post("/logout", logout);

router.get("/status", verifyJWT, status);

export default router;
