// Express app setup

import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js"; // load strategies
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

// express-rate-limit is still CommonJS...
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const rateLimit = require("express-rate-limit");

const app = express();

// Middleware
app.use(
  cors({ origin: [process.env["FRONTEND_URL"] || ""], credentials: true }),
);
app.use(express.json());
app.use(cookieParser());

// Rate limit for evry request
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 min window
    max: 500, // allow reasonable human traffic
    message: "Too many requests",
  }),
);

// Initialize Passport for login/register
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

export default app;
