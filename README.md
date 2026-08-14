
# TaskFlow

A Trello-like task management application built as a full-stack assignment.

TaskFlow provides a Kanban-style interface for managing boards, columns, and tasks with task priorities, validation, persistence, and REST APIs.

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
- Input validation
- API error handling
- Custom `AppError`
- Database persistence
- Prisma migrations
- Seed data
- REST API architecture
- Layered backend architecture
- Automated backend API testing
- Automated frontend component testing
- Loading and error states
- Production frontend build

---

## Application Structure

```text
Board
 └── Columns
      └── Tasks
````

Each board contains multiple columns, and each column contains multiple tasks.

Tasks contain information such as:

* Title
* Description
* Priority
* Column
* Timestamps

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

---

## Database

TaskFlow uses Prisma ORM with SQLite.

### Main relationships

```text
Board
 └── Column
      └── Task
```

Foreign-key relationships are enforced through the Prisma schema.

Database migrations are stored in:

```text
backend/prisma/migrations/
```

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

Backend API tests use:

* Vitest
* Supertest

The backend test suite covers API behavior including:

* Board APIs
* Column APIs
* Task APIs
* Validation
* Error handling
* Task movement

Run backend tests:

```bash
npm run test:run
```

Run backend tests in watch mode:

```bash
npm test
```

Generate backend coverage:

```bash
npm run test:coverage
```

### Frontend

Frontend tests use:

* Vitest
* React Testing Library
* jsdom

Current frontend test status:

```text
Test Files: 6 passed
Tests:      38 passed
```

Frontend coverage:

```text
Statements: 100%
Branches:   100%
Functions:  100%
Lines:      100%
```

Run frontend tests:

```bash
npm run test:run
```

Run frontend tests in watch mode:

```bash
npm test
```

Generate frontend coverage:

```bash
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

The frontend production build can be generated with:

```bash
npm run build
```

Current build verification:

```text
✓ TypeScript compilation
✓ Vite production build
✓ 75 modules transformed
```

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

### Build Frontend

```bash
cd frontend
npm run build
```

---

## Current Implementation Status

### Backend

* [x] Project setup
* [x] TypeScript configuration
* [x] Express application
* [x] Prisma + SQLite
* [x] Relational database schema
* [x] Prisma migration
* [x] Seed data
* [x] Board CRUD
* [x] Column CRUD
* [x] Task CRUD
* [x] Task priority filtering
* [x] Move task between columns
* [x] Request validation
* [x] Custom error handling
* [x] Layered architecture
* [x] Board API tests
* [x] Column API tests
* [ ] Final verification of all required Task API tests
* [ ] Final verification of required non-trivial database queries

### Frontend

* [x] React project setup
* [x] Kanban-style board UI
* [x] Board rendering
* [x] Column rendering
* [x] Task rendering
* [x] Task creation
* [x] Task editing
* [x] Task deletion
* [x] Task movement
* [x] Priority filtering
* [x] API integration
* [x] Loading states
* [x] Error states
* [x] Frontend automated tests
* [x] Production build
* [ ] Final UI polish
* [ ] Final end-to-end verification

---

## Testing Summary

Latest frontend verification:

```text
Test Files: 6 passed
Tests:      38 passed
```

Coverage:

```text
Statements: 100%
Branches:   100%
Functions:  100%
Lines:      100%
```

Production build:

```text
✓ Passed
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
* Good TypeScript integration

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

---

## Assumptions

* A single primary board is used for the initial application experience.
* Columns belong to a board.
* Tasks belong to exactly one column.
* Task priority is one of `LOW`, `MEDIUM`, or `HIGH`.
* Moving a task changes its associated column.
* SQLite is sufficient for the scope of this assignment.

---

## Future Improvements

With additional development time, the application could be extended with:

* Drag-and-drop task movement
* Multiple board selection and management UI
* Optimistic UI updates
* Pagination for large task lists
* Authentication and authorization
* Better responsive/mobile UX
* More comprehensive integration and end-to-end testing
* Production deployment with a persistent production database

---

## Project Goal

TaskFlow is being developed as a production-oriented full-stack task management application demonstrating:

* REST API design
* Layered backend architecture
* TypeScript
* Prisma ORM
* Relational database design
* Business logic separation
* Input validation
* Error handling
* Automated testing
* React frontend development
* Kanban-style task management
* Production build workflow

---

## Assignment Progress

The core TaskFlow functionality is implemented across both the backend and frontend.

Current remaining work is primarily:

```text
1. Final backend requirement verification
2. Required database-query verification
3. Final test verification
4. README/documentation refinement
5. UI/integration polish
6. Final demo/deployment verification
```

The project is currently in the final verification and polish stage.

---

## License

This project was created as a full-stack development assignment.

````

### একটা impo
