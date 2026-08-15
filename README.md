
# TaskFlow

A full-stack Trello-like task management application built as a software engineering assignment.

TaskFlow provides a Kanban-style interface for managing boards, columns, and tasks with task priorities, validation, persistence, REST APIs, automated testing, and a production-deployed frontend.

---

## Live Demo

### Frontend

**Production:**  
https://taskflow-assignment-pied.vercel.app

### Source Code

**GitHub Repository:**  
https://github.com/swarnabha-dutta/taskflow-assignment

---

## Overview

TaskFlow is a Kanban-style task management application where users can:

- Manage boards
- Manage columns
- Create tasks
- Edit tasks
- Delete tasks
- Move tasks between columns
- Filter tasks by priority
- Persist data using SQLite
- Interact with the backend through REST APIs

The application is implemented with a layered backend architecture and automated testing across both backend and frontend.

---

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
- Vite
- CSS
- Vitest
- React Testing Library
- jsdom

---

## Features

- Kanban-style task board
- Board management
- Column management
- Task management
- Create tasks
- Edit tasks
- Delete tasks
- Move tasks between columns
- Task priority filtering
- Backend validation
- Frontend validation
- API error handling
- Custom `AppError`
- SQLite database persistence
- Prisma ORM
- Prisma migrations
- Seed data
- REST API architecture
- Layered backend architecture
- Repository pattern for database access
- Automated backend API testing
- Automated frontend component testing
- Loading states
- Error states
- Production frontend build
- Production deployment using Vercel

---

## Application Structure

```text
Board
 └── Columns
      └── Tasks
````

Each board contains multiple columns, and each column contains multiple tasks.

Each task contains:

* Title
* Description
* Priority
* Column/status
* Created timestamp
* Updated timestamp

---

## Core Assignment Requirements

| Requirement                       | Status |
| --------------------------------- | ------ |
| Board with columns and tasks      | ✅      |
| Create task                       | ✅      |
| Edit task                         | ✅      |
| Delete task                       | ✅      |
| Move task between columns         | ✅      |
| Real backend + SQLite persistence | ✅      |
| Priority filtering                | ✅      |
| Empty-title validation            | ✅      |
| Backend validation                | ✅      |
| Backend error handling            | ✅      |
| Relational Prisma schema          | ✅      |
| Prisma migrations                 | ✅      |
| Seed data                         | ✅      |
| Required database queries         | ✅      |
| Backend tests                     | ✅      |
| Frontend tests                    | ✅      |
| Production build verification     | ✅      |
| Frontend deployment               | ✅      |

The implementation follows the assignment guidance that a working column-control approach is acceptable for moving tasks instead of requiring drag-and-drop.

---

# API

All backend routes are exposed under:

```text
/api
```

## Boards

```text
GET    /api/boards
GET    /api/boards/:id
POST   /api/boards
PATCH  /api/boards/:id
DELETE /api/boards/:id
```

## Columns

```text
GET    /api/columns/board/:boardId
GET    /api/columns/:id
POST   /api/columns/board/:boardId
PATCH  /api/columns/:id
DELETE /api/columns/:id
```

## Tasks

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

---

## Task API Capabilities

The Task API supports:

* Creating tasks
* Retrieving all tasks
* Retrieving a task by ID
* Retrieving tasks by column
* Filtering tasks by priority
* Updating task details
* Moving tasks between columns
* Deleting tasks
* Validating task titles
* Validating target columns
* Handling missing tasks and columns
* Returning predictable HTTP errors

---

# Backend Architecture

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
Prisma ORM
  ↓
SQLite
```

### Routes

Responsible for:

* Defining API endpoints
* Connecting routes to controllers

### Controllers

Responsible for:

* Handling HTTP requests
* Extracting request data
* Calling services
* Returning API responses

### Services

Responsible for:

* Business logic
* Business rule validation
* Application-level error handling

### Repositories

Responsible for:

* Database operations
* Prisma queries
* Keeping persistence logic separated from business logic

This separation keeps HTTP handling, business logic, and persistence concerns independent and easier to test.

---

# Validation

Request validation is handled using Zod and application-level validation.

Examples include:

```text
- Required board names
- Required column names
- Non-negative column positions
- Required task titles
- Valid task priorities
- Valid target columns when moving tasks
```

The backend explicitly rejects task creation when the title is missing or empty.

---

# Error Handling

The backend uses a custom `AppError` class for predictable application errors.

## 400 Bad Request

Examples:

```text
- Board name is required
- Column name is required
- Column position must be a non-negative integer
- Task title is required
```

## 404 Not Found

Examples:

```text
- Board not found
- Column not found
- Task not found
- Target column not found
```

API errors follow a consistent structure:

```json
{
  "success": false,
  "message": "Resource not found"
}
```

The frontend also displays user-facing loading and error states instead of leaving failed requests as a blank UI.

---

# Database

TaskFlow uses **Prisma ORM with SQLite**.

## Main Relationships

```text
Board
 └── Column
      └── Task
```

Relational structure:

```text
Board 1 ──── * Column
Column 1 ──── * Task
```

The Prisma schema defines the relational structure and foreign-key relationships.

### Schema

```text
backend/prisma/schema.prisma
```

### Migrations

```text
backend/prisma/migrations/
```

---

# Database Queries

The repository layer performs database-level queries instead of fetching all records and filtering them in application code.

## Tasks by Priority

The repository uses a Prisma `where` clause and database ordering:

```ts
findByPriority(priority: Priority) {
    return prisma.task.findMany({
        where: {
            priority,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            column: true,
        },
    });
}
```

This directly queries tasks matching the requested priority and returns the newest tasks first.

## Tasks per Column

The repository/service layer also supports database-level column-based task retrieval/counting.

Example:

```ts
prisma.task.count({
    where: {
        columnId,
    },
});
```

These queries demonstrate direct relational database querying through Prisma instead of performing filtering in the frontend.

---

# Seed Data

The database can be populated with sample data including:

* TaskFlow Board
* To Do column
* In Progress column
* Done column
* Sample tasks
* Different task priorities

Run the seed command:

```bash
npm run db:seed
```

---

# Testing

TaskFlow uses automated testing across both backend and frontend.

---

## Backend Testing

Backend tests use:

* Vitest
* Supertest

The backend test suite covers:

* Board APIs
* Column APIs
* Task APIs
* Empty-title validation
* Priority filtering
* Error handling
* Task movement
* Database/repository behavior

Required assignment cases are explicitly covered:

1. Creating a task without a title fails.
2. Moving a task updates its column/status.
3. A database-layer test verifies query behavior against known data.

### Run Backend Tests

```bash
cd backend
npm run test:run
```

### Watch Mode

```bash
cd backend
npm test
```

### Coverage

```bash
cd backend
npm run test:coverage
```

---

## Frontend Testing

Frontend tests use:

* Vitest
* React Testing Library
* jsdom

Latest verified frontend test result:

```text
Test Files: 6 passed
Tests:      38 passed
```

Latest verified frontend coverage:

```text
Statements: 90.9%
Branches:   88%
Functions:  96.77%
Lines:      90.9%
```

The coverage focuses on meaningful application behavior rather than adding artificial tests only to increase the coverage percentage.

### Run Frontend Tests

```bash
cd frontend
npm run test:run
```

### Watch Mode

```bash
cd frontend
npm test
```

### Coverage

```bash
cd frontend
npm run test:coverage
```

---

# Backend Setup

## 1. Clone the Repository

```bash
git clone https://github.com/swarnabha-dutta/taskflow-assignment.git
cd taskflow-assignment
```

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

## 3. Create Environment Variables

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL="file:./dev.db"
```

## 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

## 5. Generate Prisma Client

```bash
npx prisma generate
```

## 6. Seed the Database

```bash
npm run db:seed
```

## 7. Start Backend

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

---

# Frontend Setup

Open a new terminal.

## 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 2. Create Environment Variables

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

## 3. Start Frontend

```bash
npm run dev
```

The frontend will be available at the Vite development URL shown in the terminal.

---

# Production Build

Both applications have been verified using their respective build/TypeScript compilation commands.

## Frontend

```bash
cd frontend
npm run build
```

Verified result:

```text
✓ TypeScript compilation
✓ Vite production build
✓ Build completed successfully
```

## Backend

```bash
cd backend
npm run build
```

Verified result:

```text
> backend@1.0.0 build
> tsc
```

No TypeScript errors were reported.

---

# Deployment

The frontend is deployed to Vercel.

## Production Frontend

```text
https://taskflow-assignment-pied.vercel.app
```

The Vercel deployment is connected to the GitHub repository and the `main` branch.

A production deployment is automatically generated from the configured frontend directory.

---

# Project Structure

```text
taskflow-assignment/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── generated/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── tests/
│   │   ├── board.test.ts
│   │   ├── column.test.ts
│   │   └── task.test.ts
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── package.json
│   └── vitest.config.ts
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# Development Workflow

## Start Backend

```bash
cd backend
npm run dev
```

## Start Frontend

```bash
cd frontend
npm run dev
```

## Run Backend Tests

```bash
cd backend
npm run test:run
```

## Run Frontend Tests

```bash
cd frontend
npm run test:run
```

## Generate Frontend Coverage

```bash
cd frontend
npm run test:coverage
```

## Build Backend

```bash
cd backend
npm run build
```

## Build Frontend

```bash
cd frontend
npm run build
```

---

# Design Decisions

## SQLite

SQLite was selected because the assignment explicitly allows SQLite and it provides a simple relational database setup suitable for the scope of the application.

## Prisma

Prisma provides:

* Type-safe database access
* Schema management
* Migrations
* Relational queries
* Strong TypeScript integration

## Layered Backend

The backend separates:

```text
HTTP layer
Business logic
Database access
```

This keeps controllers lightweight and makes the application easier to test and maintain.

## REST API

The application uses RESTful endpoints for communication between the React frontend and Express backend.

## Task Movement

Task movement is implemented through a dedicated API endpoint:

```text
PATCH /api/tasks/:id/move
```

This keeps the operation explicit and persists the new column/status in the database.

---

# Assumptions

* A single primary board is used for the initial application experience.
* Columns belong to a board.
* Tasks belong to exactly one column.
* Task priority is one of `LOW`, `MEDIUM`, or `HIGH`.
* Moving a task changes its associated column.
* SQLite is sufficient for the scope of this assignment.
* Authentication, multi-user support, real-time synchronization, file uploads, and other explicitly out-of-scope features were intentionally not implemented.

---

# What I Would Improve With More Time

If more development time were available, I would consider:

* Drag-and-drop task movement
* Multiple board selection and management UI
* Optimistic UI updates
* Pagination for large task lists
* Authentication and authorization
* More responsive/mobile UX
* Additional integration and end-to-end tests
* Production deployment with a persistent production database
* Additional accessibility and UI polish

These improvements are intentionally secondary to keeping the required core functionality stable and maintainable.

---

# Development Process

The project was developed iteratively with the following focus:

1. Backend and database foundation
2. Prisma schema and migrations
3. REST API implementation
4. Validation and error handling
5. Repository/service/controller separation
6. React Kanban UI
7. Task CRUD functionality
8. Task movement and priority filtering
9. Automated backend testing
10. Automated frontend testing
11. Coverage verification
12. Production build verification
13. Vercel deployment
14. Final documentation and submission hardening

---

# What I Learned

One of the most useful parts of the assignment was separating database access into a repository layer instead of placing Prisma queries directly inside controllers.

This made it easier to reason about:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
SQLite
```

It also made the required database-level query testing more explicit and kept business logic separate from persistence logic.

---

# Current Verification Status

Latest verified state:

```text
Backend tests           40 passed
Frontend tests          38 passed

Frontend coverage
Statements              90.9%
Branches                88%
Functions               96.77%
Lines                   90.9%

Frontend build          ✓ Passed
Backend build           ✓ Passed
Production deployment   ✓ Ready
```

---

# Submission Checklist

Before submitting the assignment, verify:

* [x] GitHub repository is public/accessibly shared
* [x] Frontend production deployment is live
* [x] Backend tests pass
* [x] Frontend tests pass
* [x] Frontend coverage verified
* [x] Backend build passes
* [x] Frontend build passes
* [x] Prisma schema and migrations are committed
* [x] Seed script is committed
* [x] README documentation is updated
* [x] API endpoints are documented
* [x] Environment variable setup is documented
* [x] Live demo URL is included
* [x] GitHub repository URL is included

---

# Future Scope

Possible future enhancements include:

* Drag-and-drop support
* Task title search
* Task count summaries
* Multiple boards
* Authentication
* Real-time collaboration
* Production database
* More comprehensive E2E testing
* Advanced accessibility improvements
* Optimistic UI updates

The current implementation intentionally prioritizes a clean, working, tested core over optional feature volume.

---

## Links

**Live Demo:**
[https://taskflow-assignment-pied.vercel.app](https://taskflow-assignment-pied.vercel.app)

**GitHub:**
[https://github.com/swarnabha-dutta/taskflow-assignment](https://github.com/swarnabha-dutta/taskflow-assignment)

```
---
