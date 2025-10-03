# Node.js + React Full-Stack Skeleton Project

This repository provides a **starter full-stack project** using:

- **Backend:** Node.js, TypeScript, Express, Passport.js, Prisma, Postgres
- **Frontend:** React, TypeScript, Material UI
- **Auth:** Email/password + Google OAuth, JWT stored in HttpOnly cookies
- **Admin:** Role management via a Material DataGrid
- **Profile:** Profile management via a Material components
- **UI:** Theme toggle (light/dark mode)

---

## Features

- Full authentication system (register, login, logout, JWT auth)
- Google social login integration
- User roles (admin/user) with admin panel
- Profile page with email & password update
- MUI-based design with reusable components
- Theme toggle (light/dark)
- Prisma + Postgres database integration

---

## Folder Structure

- /backend → Node.js + Express + Prisma
- /frontend → React + MUI + React Router

---

## Getting Started

1. Clone the repo:

```bash
git clone https://github.com/davidkakov111/skeleton-nr-auth.git
cd skeleton-nr-auth
```

2. Setup backend and frontend separately (see /backend/README.md and /frontend/README.md)

## Recommended Workflow

- Backend API development in /backend
- Frontend UI development in /frontend
- Use .env files for secrets and database configuration

---
