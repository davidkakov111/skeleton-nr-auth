// Express app setup

import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js"; // load strategies
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(cors({ origin: [process.env['FRONTEND_URL'] || ''], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Initialize Passport for login/register
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

export default app;
