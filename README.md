
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
- Error handling with custom `AppError`
- Database persistence
- Seed data
- REST API architecture
- Automated API testing with Vitest and Supertest

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

```
GET    /api/tasks
GET    /api/tasks?priority=HIGH
GET    /api/tasks/column/:columnId
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
PATCH  /api/tasks/:id/move
DELETE /api/tasks/:id
```

## Task API Capabilities

The Task API supports:

* Create tasks
* Retrieve all tasks
* Retrieve a task by ID
* Retrieve tasks by column
* Filter tasks by priority
* Update task details
* Move tasks between columns
* Delete tasks
* Validate task titles
* Validate target columns
* Handle missing tasks and columns with proper HTTP errors

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

### Responsibilities

**Routes**

* Define API endpoints
* Connect routes to controllers

**Controllers**

* Handle HTTP requests and responses
* Pass request data to services
* Return consistent API responses

**Services**

* Contain business logic
* Validate business rules
* Handle application-level errors

**Repositories**

* Handle database operations
* Keep Prisma queries separated from business logic

## Error Handling

The backend uses a custom `AppError` class for predictable application errors.

Examples:

```text
400 Bad Request
- Board name is required
- Column name is required
- Column position must be a non-negative integer
- Task title is required

404 Not Found
- Board not found
- Column not found
- Task not found
- Target column not found
```

API errors follow the following structure:

```json
{
  "success": false,
  "message": "Resource not found"
}
```

## Testing

Backend API tests are written using:

* Vitest
* Supertest

Current tested modules include:

```text
Board API
Column API
```

Run the test suite:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm test
```

Generate coverage:

```bash
npm run test:coverage
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
│   ├── package.json
│   └── vitest.config.ts
│
└── frontend/
```

## Current Progress

### Backend

* [x] Project setup
* [x] Prisma + SQLite
* [x] Database schema
* [x] Migration
* [x] Seed data
* [x] Board CRUD
* [x] Column CRUD
* [x] Task CRUD
* [x] Task priority filtering
* [x] Move task between columns
* [x] Custom error handling
* [x] Board API tests
* [x] Column API tests
* [ ] Final Task API test verification
* [ ] Backend API documentation refinement

### Frontend

* [ ] React project setup
* [ ] Kanban board UI
* [ ] Board management UI
* [ ] Column management UI
* [ ] Task management UI
* [ ] Drag-and-drop task movement
* [ ] API integration
* [ ] Loading and error states
* [ ] Responsive design

## Development Workflow

Start the backend:

```bash
cd backend
npm run dev
```

Run backend tests:

```bash
npm run test:run
```

Generate test coverage:

```bash
npm run test:coverage
```

## Project Goal

TaskFlow is being developed as a production-oriented full-stack task management application demonstrating:

* REST API design
* Layered backend architecture
* TypeScript
* Prisma ORM
* Relational database design
* Business logic separation
* Error handling
* Automated API testing
* React frontend development
* Kanban-style task management

---
 roughly 75–80% of the assignment backend side**, with Board + Column + Task APIs largely implemented. Main remaining work is **Task API test completion/verification → frontend → integration/polish → final README/demo**.
