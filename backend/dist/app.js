// Express app setup
import express from "express";
import cors from "cors";
// import passport from "passport";
// import session from "express-session";
// import "./config/passport.js"; // load strategies
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
const app = express();
app.use(cors({ origin: [process.env['FRONTEND_URL'] || ''] }));
app.use(express.json());
// session needed for Passport OAuth (Google)
// app.use(session({ secret: "supersecret", resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
export default app;
//# sourceMappingURL=app.js.map