import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);

// login with passport local
router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    login
);

export default router;
