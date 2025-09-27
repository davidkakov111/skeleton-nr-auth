// Express app setup

import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js"; // load strategies
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors({ origin: [process.env['FRONTEND_URL'] || ''] }));
app.use(express.json());

// Initialize Passport for login/register
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

export default app;
