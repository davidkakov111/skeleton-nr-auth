# Backend - Node.js + Express + Prisma

This is the **backend** of the full-stack skeleton project.

---

## Tech Stack

- Node.js + TypeScript
- Express.js
- Passport.js (email/password + Google OAuth)
- JWT auth stored in HttpOnly cookies
- Prisma ORM + Postgres

---

## Features

- Authentication: register, login, logout
- Social login via Google
- Role-based authorization (admin/user)
- User management (profile update, password change)
- Admin APIs: update user roles
- Secure JWT handling with refresh/status APIs

---

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create .env file based on .env.example

3. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

4. Start development server:
```bash
npm run dev
```

The backend runs on http://localhost:5000 by default.

---
