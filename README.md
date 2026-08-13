
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
````

### Backend Structure

```text
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

### Current Backend Progress

* Express + TypeScript setup
* ESM configuration
* Prisma 7 configuration
* SQLite database
* Relational database schema
* Prisma migration
* Prisma Client generation
* Database connection verification
* Seed data
* Repository layer
* Service layer

---

## Database

TaskFlow uses SQLite with Prisma.

### Data Model

```text
Board
  │
  └── Column
        │
        └── Task
```

* A Board contains multiple Columns.
* A Column contains multiple Tasks.
* A Task belongs to one Column.
* Task priority: Low, Medium, High.
* Task title is required.
* Task description is optional.
* Tasks store creation timestamps.

### Seed Data

The development database is seeded with:

```text
TaskFlow Board

├── To Do
│   ├── Setup project
│   └── Design database
│
├── In Progress
│   └── Build backend API
│
└── Done
    └── Initialize Prisma
```

Run:

```bash
npm run db:seed
```

### Database Queries

The repository layer contains database-level queries for:

* Tasks belonging to a specific column
* Tasks filtered by priority and ordered by newest first

---

## Frontend

Frontend implementation is planned after the backend core is completed.

Planned features:

* Board view
* Columns and tasks
* Create task
* Edit task
* Delete task
* Move task between columns
* Priority filtering
* Backend error feedback

---

## Development Status

### Completed

* [x] Project structure
* [x] Backend setup
* [x] Prisma + SQLite
* [x] Database schema
* [x] Migration
* [x] Prisma Client
* [x] Database connection
* [x] Seed data
* [x] Repository layer
* [x] Service layer

### In Progress

* [ ] Validation
* [ ] Error handling
* [ ] Controllers
* [ ] API routes
* [ ] Backend tests
* [ ] Frontend

---

## Assignment Requirements

The implementation follows the core TaskFlow requirements:

* Persistent backend + database
* Board → Column → Task relationship
* Task CRUD
* Task movement between columns
* Priority filtering
* Backend validation
* Database queries
* Seed data
* Backend tests

---
