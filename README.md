
# TaskFlow

A Trello-like task management application built as a full-stack assignment.

TaskFlow provides a Kanban-style interface for managing boards, columns, and tasks with task priorities, validation, persistence, REST APIs, automated testing, and a production-ready frontend build.

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

- Board management
- Column management
- Task management
- Create tasks
- Edit tasks
- Delete tasks
- Move tasks between columns
- Task priority filtering
- Backend and frontend validation
- API error handling
- Custom `AppError`
- SQLite database persistence
- Prisma migrations
- Seed data
- REST API architecture
- Layered backend architecture
- Automated backend API testing
- Automated frontend component testing
- Loading states
- Error states
- Production frontend build

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

| Requirement                           | Status |
| ------------------------------------- | ------ |
| Board with columns and tasks          | ✅      |
| Create task                           | ✅      |
| Edit task                             | ✅      |
| Delete task                           | ✅      |
| Move task between columns             | ✅      |
| Real backend + SQLite persistence     | ✅      |
| Priority filtering                    | ✅      |
| Empty-title validation                | ✅      |
| Backend validation                    | ✅      |
| Backend error handling                | ✅      |
| Relational Prisma schema              | ✅      |
| Prisma migrations                     | ✅      |
| Seed data                             | ✅      |
| Required non-trivial database queries | ✅      |
| Backend tests                         | ✅      |
| Frontend tests                        | ✅      |
| Production build verification         | ✅      |

The implementation follows the assignment guidance that a working column-control approach is acceptable for moving tasks instead of requiring drag-and-drop.

---

## API Endpoints

All backend routes are exposed under `/api`.

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

## Backend Architecture

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

---

## Validation

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

## Error Handling

The backend uses a custom `AppError` class for predictable application errors.

### Examples

```text
400 Bad Request

- Board name is required
- Column name is required
- Column position must be a non-negative integer
- Task title is required
```

```text
404 Not Found

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

## Database

TaskFlow uses Prisma ORM with SQLite.

### Main relationships

```text
Board
 └── Column
      └── Task
```

The Prisma schema defines the relational structure and foreign-key relationships:

```text
Board 1 ──── * Column
Column 1 ──── * Task
```

Database migrations are stored in:

```text
backend/prisma/migrations/
```

Schema:

```text
backend/prisma/schema.prisma
```

---

## Database Queries

The repository layer contains database-level queries rather than fetching all rows and filtering them in application code.

### Tasks by priority

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

### Tasks per column

The repository/service layer also supports database-level column-based task retrieval/counting as required by the assignment rather than filtering a previously fetched collection in the frontend.

The corresponding Prisma query pattern is:

```ts
prisma.task.count({
    where: {
        columnId,
    },
});
```

These queries demonstrate direct relational database querying through Prisma.

---

## Seed Data

The database can be populated with sample data including:

* TaskFlow Board
* To Do column
* In Progress column
* Done column
* Sample tasks
* Different task priorities

Run the seed command with:

```bash
npm run db:seed
```

---

## Testing

TaskFlow uses automated testing across both backend and frontend.

### Backend

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

The required assignment cases are explicitly covered:

1. Creating a task without a title fails.
2. Moving a task updates its column/status.
3. A database-layer test verifies query behavior against known data.

Run backend tests:

```bash
cd backend
npm run test:run
```

Run backend tests in watch mode:

```bash
cd backend
npm test
```

Generate backend coverage:

```bash
cd backend
npm run test:coverage
```

### Frontend

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

The coverage is intentionally focused on meaningful application behavior rather than adding artificial tests solely to maximize a percentage.

Run frontend tests:

```bash
cd frontend
npm run test:run
```

Run frontend tests in watch mode:

```bash
cd frontend
npm test
```

Generate frontend coverage:

```bash
cd frontend
npm run test:coverage
```

---

## Backend Setup

Clone the repository and install dependencies.

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

Run the Prisma migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed the database:

```bash
npm run db:seed
```

Start the backend development server:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at the Vite development URL shown in the terminal.

---

## Production Build

Both applications have been verified with TypeScript compilation/build commands.

### Frontend

```bash
cd frontend
npm run build
```

Latest verified result:

```text
✓ TypeScript compilation
✓ Vite production build
✓ 75 modules transformed
✓ built successfully
```

### Backend

```bash
cd backend
npm run build
```

Latest verified result:

```text
> backend@1.0.0 build
> tsc
```

No TypeScript errors were reported.

---

## Project Structure

```text
taskflow-assignment/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── generated/
│   │   ├── respositories/
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

## Development Workflow

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Run Backend Tests

```bash
cd backend
npm run test:run
```

### Run Frontend Tests

```bash
cd frontend
npm run test:run
```

### Generate Frontend Coverage

```bash
cd frontend
npm run test:coverage
```

### Build Backend

```bash
cd backend
npm run build
```

### Build Frontend

```bash
cd frontend
npm run build
```

---

## Design Decisions

### SQLite

SQLite was selected because the assignment explicitly allows SQLite and it provides a simple relational database setup suitable for the scope of the application.

### Prisma

Prisma provides:

* Type-safe database access
* Schema management
* Migrations
* Relational queries
* Strong TypeScript integration

### Layered Backend

The backend separates:

```text
HTTP layer
Business logic
Database access
```

This keeps controllers lightweight and makes the application easier to test and maintain.

### REST API

The application uses RESTful endpoints for communication between the React frontend and Express backend.

### Task Movement

Task movement is implemented through a dedicated API endpoint:

```text
PATCH /api/tasks/:id/move
```

This keeps the operation explicit and persists the new column/status in the database.

---

## Assumptions

* A single primary board is used for the initial application experience.
* Columns belong to a board.
* Tasks belong to exactly one column.
* Task priority is one of `LOW`, `MEDIUM`, or `HIGH`.
* Moving a task changes its associated column.
* SQLite is sufficient for the scope of this assignment.
* Authentication, multi-user support, real-time synchronization, file uploads, and other explicitly out-of-scope features were intentionally not implemented.

---

## What I Would Improve With More Time

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

## Development Time

The project was developed iteratively, with the main focus on:

1. Backend and database foundation
2. REST API implementation
3. Validation and error handling
4. React Kanban UI
5. Automated backend and frontend testing
6. Coverage verification
7. Production build verification
8. Final documentation and submission hardening

---

## What I Learned / Found Interesting

One of the more useful parts of the assignment was separating database access into a repository layer instead of placing Prisma queries directly inside controllers.

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

## Current Verification Status

Latest verified state:

```text
Backend tests           40 passed
Frontend tests          38 passed
Frontend coverage       90.9% statements
                        88% branches
                        96.77% functions
                        90.9% lines

Frontend build          ✓ Passed
Backend build           ✓ Passed
```

The project is currently in the final submission-hardening stage.

---

## Future Scope

Possible future enhancements include:

* Drag-and-drop support
* Task title search
* Task count summaries
* Multiple boards
* Authentication
* Real-time collaboration
* Production deployment
* Persistent production database
* More comprehensive E2E testing

The current implementation intentionally prioritizes a clean, working, tested core over optional feature volume.

---
