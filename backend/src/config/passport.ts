// Passport strategies (local + Google)

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./db.js";
import { validateEmail, validatePassword } from "../utils/auth.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { randomUUID } from "crypto";
import type { User } from "../../generated/prisma/index.js";

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
        // Get relevant google account details
        const googleEmail =
          profile.emails?.[0]?.value ||
          `google_${Date.now()}_${randomUUID()}@placeholder.local`;
        const googleEmailVerified = profile._json?.email_verified ?? false;
        const googleId = profile.id;

        // Check for already existing user (max 2 record, since both googleId and email are unique fields)
        let users = await prisma.user.findMany({
          where: {
            OR: [{ googleId }, { email: googleEmail }],
          },
        });
        let user: User | undefined;

        if (users.length > 0) {
          // If there are posible users matches in db
          user = users.find((u) => u.googleId === googleId); // Find already existing user with this google id

          if (!user) {
            // There is a single user match by email
            const dbUserByEmail = users[0]!;

            if (!dbUserByEmail.googleId) {
              // If the existing account with this email does not have a googleId
              if (!googleEmailVerified) {
                return done(
                  new Error(
                    "This Google email is already associated with a non-Google account in our system. However, because your Google email is not verified, we cannot link it to your existing account. Please verify your Google email with Google, or log in using your original credentials.",
                  ),
                  undefined,
                );
              }
              user = await prisma.user.update({
                where: { id: dbUserByEmail.id },
                data: { googleId },
              });
            } else {
              return done(
                new Error(
                  "This Google account's email is already linked to another Google account in our system.",
                ),
                undefined,
              );
            }
          }
        } else {
          // Create new user
          user = await prisma.user.create({
            data: { googleId, email: googleEmail },
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
