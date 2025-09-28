import { Router } from "express";
import passport from "passport";
import { register, login, logout, status } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);

router.post(
    "/login",
    passport.authenticate("local", { session: false }), // login with passport local
    login
);

router.post("/logout", logout);

router.get("/status", verifyJWT, status);

export default router;
