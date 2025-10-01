// Passport strategies (local + Google)

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./db.js";
import { validateEmail, validatePassword } from "../utils/auth.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { randomUUID } from "crypto";

// Configure Passport to use the "local" strategy for email/password login
// It looks up the user by email, checks the password, and passes the user object if valid
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // use email instead of username
    async (email, password, done) => {
      try {
        // Basic validation
        if (!validateEmail(email)) {
          return done(null, false, { message: "Invalid email format" });
        } else if (!validatePassword(password)) {
          return done(null, false, {
            message:
              "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.",
          });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: "User not found" });

        // If the user has no password (social login), reject login
        if (!user.password)
          return done(null, false, {
            message: "Missing user password. Try social login.",
          });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Invalid password" });

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    },
  ),
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"] as string,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] as string,
      callbackURL: `${process.env["BACKEND_URL"]}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          `google_${Date.now()}_${randomUUID()}@placeholder.local`;

        // Check for already existing user
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId: profile.id }, { email }],
          },
        });

        if (user) {
          // If user has no googleId yet, link it
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id },
            });
          }
        } else {
          // Create new user
          user = await prisma.user.create({
            data: { googleId: profile.id, email },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    },
  ),
);

export default passport;
