
# TaskFlow

A Trello-like task management application built as a full-stack assignment.

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQLite
- Zod
- Vitest
- Supertest

### Frontend
- React
- TypeScript
- Kanban-style UI

## Features

- Board management
- Column management
- Task management
- Task priority filtering
- Move tasks between columns
- Input validation
- Database persistence
- Seed data
- REST API architecture

## Database Structure

```text
Board
 └── Columns
      └── Tasks
````

## API Endpoints

### Boards

```text
GET    /api/boards
GET    /api/boards/:id
POST   /api/boards
PATCH  /api/boards/:id
DELETE /api/boards/:id
```

### Columns

```text
GET    /api/columns/board/:boardId
GET    /api/columns/:id
POST   /api/columns/board/:boardId
PATCH  /api/columns/:id
DELETE /api/columns/:id
```

### Tasks

```text
GET    /api/tasks
GET    /api/tasks?priority=HIGH
GET    /api/tasks/column/:columnId
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
PATCH  /api/tasks/:id/move
DELETE /api/tasks/:id
```

## Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
DATABASE_URL="file:./dev.db"
```

Run Prisma migration:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed the database:

```bash
npm run db:seed
```

Start the backend:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

## Seed Data

The database is seeded with:

* TaskFlow Board
* To Do
* In Progress
* Done
* Sample tasks with different priorities

## Current Progress

* [x] Project setup
* [x] Prisma + SQLite
* [x] Database schema
* [x] Migration
* [x] Seed data
* [x] Board CRUD
* [x] Column CRUD
* [ ] Task API

---
