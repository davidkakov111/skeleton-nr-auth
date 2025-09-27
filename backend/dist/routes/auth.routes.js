// Login, Register, Google OAuth, etc.
import { Router } from "express";
// import passport from "passport";
// import { registerUser, loginUser, googleCallback } from "../controllers/auth.controller";
const router = Router();
router.get("/", () => { console.log("Auth route"); });
// Local auth
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// // Google OAuth
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);
export default router;
//# sourceMappingURL=auth.routes.js.map