# TaskFlow

A lightweight full-stack task board inspired by Trello, built as a take-home assignment.

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- Zod
- Vitest
- Supertest

### Frontend
- React
- TypeScript
- Vite

---

## Backend

The backend follows a layered architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Prisma
  ↓
SQLite
```
---
# Backend Structure

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
└── tests/


```
