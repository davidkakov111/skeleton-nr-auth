// Passport strategies (local + Google)

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./db.js";

// Configure Passport to use the "local" strategy for email/password login
// It looks up the user by email, checks the password, and passes the user object if valid
passport.use(
    new LocalStrategy(
        { usernameField: "email" }, // use email instead of username
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return done(null, false, { message: "User not found" });

                // If the user has no password (social login), reject login
                if (!user.password) return done(null, false, { message: "Missing user password" });

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return done(null, false, { message: "Invalid password" });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

export default passport;
