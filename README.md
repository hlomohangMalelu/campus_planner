# Campus Planner

Campus Planner is a full-stack academic planning application designed to help university students organize their semesters, courses, assignments, and other academic activities in one place.

The project is being built as a practical showcase of backend development skills with Node.js and Express, while also providing a real user-facing application with a dedicated UI.

> **Project status:** In active development.

## Project Goals

Campus Planner aims to provide students with a simple way to:

- Manage their academic semesters
- Organize courses under each semester
- Track assignments and deadlines
- Keep academic information organized by course
- Eventually manage exams, timetables, study plans, and other academic resources
- Access their information securely through authentication

The project is also being developed as a learning project to demonstrate good backend architecture, validation, authentication, database design, and API development.

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

### Frontend

The frontend/UI is part of the project and will provide the user-facing Campus Planner application.

### Development Principles

The project follows a layered backend architecture:

```text
Routes
   ↓
Validators
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
Database
```

This separation is intended to make the application easier to maintain and make future database migration easier.

---

## Core Architecture

### Validators

Validators are responsible for validating and normalizing user input before it reaches the controller.

Examples include:

- Required-field validation
- Name validation
- Email validation
- Password validation
- MongoDB ObjectId validation
- Course-code validation
- Credit validation
- Date validation

Validated data is passed through:

```javascript
req.validatedData
```

### Controllers

Controllers handle HTTP concerns.

They:

1. Read authenticated/validated data
2. Call the appropriate service
3. Return the HTTP response

Controllers do not contain the application's main business logic.

### Services

Services contain business logic and database operations.

For example, creating a Course requires more than validating its fields. The service must verify that:

- The requested Semester exists
- The Semester belongs to the authenticated user
- The Course does not already exist in that Semester

This logic belongs in the service layer.

### Models

Mongoose models define the database structure and provide database-level validation and constraints.

Mongoose validation acts as an additional safety layer after application-level validation.

---

# Authentication

Campus Planner uses JWT-based authentication.

The authentication flow is:

```text
Register
   ↓
Validate input
   ↓
Hash password
   ↓
Create user
   ↓
Login
   ↓
Verify password
   ↓
Create JWT
   ↓
Authenticated requests
```

Passwords are hashed using bcrypt before being stored.
---

# Data Model

The current academic hierarchy is:

```text
User
 └── Semester
      └── Course
           └── Assignment
```

## User

A User represents a Campus Planner account.

Current account information includes:

- First name
- Last name
- Email
- Password

Username/profile functionality can be expanded separately.

---

## Semester

A Semester belongs to a User.

A Semester contains:

- Name
- Academic year
- Start date
- End date
- Status
- Creator

Supported semester statuses:

```text
upcoming
active
completed
```

Example:

```text
Semester 1
Academic Year: 2026/2027
Start: January 2026
End: June 2026
Status: active
```

A user's semester is identified through ownership:

```text
createdBy → User
```

---

## Course

A Course belongs to a Semester and a User.

A Course contains:

- Name
- Code
- Credits
- Description
- Semester ID
- Creator

Course codes are normalized to uppercase.

For example:

```text
cs3411
CS3411
Cs3411
```

are normalized to:

```text
CS3411
```

Courses are unique within a user's semester:

```text
createdBy + semesterId + code
```

---

## Assignment

An Assignment belongs to a Course and a User.

Current fields include:

- Title
- Description
- Due date
- Status
- Priority
- Course ID
- Creator

Assignment statuses:

```text
pending
completed
overdue
```

Assignment priorities:

```text
low
medium
high
```

---

# Ownership and Authorization

Campus Planner uses ownership checks throughout the service layer.

For example, retrieving a Course does not simply search by:

```javascript
_id: courseId
```

It searches by:

```javascript
{
    _id: courseId,
    createdBy: userId
}
```

This ensures users can only access their own resources.

The same ownership principle applies to nested resources.

```text
User
 ↓ owns
Semester
 ↓ owns
Course
 ↓ owns
Assignment
```

A child resource must belong to a parent resource owned by the authenticated user.

---

# Cascade Deletion

Campus Planner follows a parent-child deletion model.

When a parent resource is deleted, resources owned by it should also be removed.

For example:

```text
Delete Semester
    ↓
Delete Courses
    ↓
Delete Assignments
    ↓
Delete other course-owned resources
```

Similarly:

```text
Delete Course
    ↓
Delete Assignments
    ↓
Delete other Course-owned resources
```

A child resource must never delete its parent.

For example:

```text
Deleting Course
    ↓
does NOT delete Semester
```

Cascade behavior will expand as additional academic resources are introduced.

---

# API Design

The API follows REST-style resource endpoints.

Examples:

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login

GET    /api/v1/semesters
GET    /api/v1/semesters/:id
POST   /api/v1/semesters
PATCH  /api/v1/semesters/:id
DELETE /api/v1/semesters/:id

GET    /api/v1/courses
GET    /api/v1/courses/:id
POST   /api/v1/courses
PATCH  /api/v1/courses/:id
DELETE /api/v1/courses/:id
```

Course filtering supports:

```text
GET /api/v1/courses?semesterId=<semesterId>
```

This returns courses belonging to the authenticated user's specified semester.

Empty collections return a successful response rather than a Not Found error.

Example:

```json
{
    "success": true,
    "courses": [],
    "nbHits": 0
}
```

---

# Error Handling

The application uses custom API errors for different HTTP situations.

Examples include:

```text
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
```

Examples:

| Situation | Response |
|---|---|
| Invalid input | 400 |
| Invalid authentication | 401 |
| Resource not found | 404 |
| Duplicate resource | 409 |

For example, attempting to create a duplicate Course within the same Semester results in a conflict.

---

# Validation Strategy

Campus Planner uses two levels of validation.

## Application-Level Validation

Input is validated before reaching the controller.

Example:

```text
Request
   ↓
Validator
   ↓
Validated data
   ↓
Controller
```

This provides clear and user-friendly error messages.

## Mongoose Validation

Mongoose remains a second line of defense.

The database model defines constraints such as:

- Required fields
- Maximum lengths
- Enums
- References
- Unique indexes

This means invalid data should not reach the database even if application-level validation is accidentally bypassed.

---

# Database Constraints

Database-level uniqueness is used where appropriate.

For Courses:

```javascript
CourseSchema.index(
    {
        createdBy: 1,
        semesterId: 1,
        code: 1
    },
    {
        unique: true
    }
);
```

This provides a database-level guarantee that a user cannot have two Courses with the same code in the same Semester.

Application-level checks are still performed so that users receive meaningful conflict responses.

---

# Profile Management

Authenticated users can manage their profile information.

Current profile functionality includes:

- Viewing profile
- Updating first name
- Updating last name
- Updating email
- Changing password

Changing a password requires:

```text
Current password
New password
Confirm new password
```

The application also prevents changing the password to the same password currently in use.

---

# Project Structure

The backend follows a modular structure similar to:

```text
src/
├── controllers/
├── errors/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
├── utils/
└── app.js
```

The exact structure may evolve as the project grows.

The important architectural separation is:

```text
controllers/
    HTTP logic

services/
    business logic + database operations

validators/
    request validation

models/
    database schemas

middleware/
    cross-cutting request processing

utils/
    reusable helpers
```

---

# Current Development Progress

## Sprint 1 — Authentication & Profiles

- [x] User model
- [x] Registration validation
- [x] Password hashing
- [x] Login
- [x] JWT authentication
- [x] Authorization middleware
- [x] Public user profile
- [x] Update profile
- [x] Change password
- [ ] Forgot password flow
- [ ] Username/profile expansion

## Sprint 2 — Semesters

- [x] Semester model
- [x] Semester validation
- [x] Create semester
- [x] List semesters
- [x] Get semester
- [x] Update semester
- [x] Delete semester
- [x] Semester ownership
- [x] Semester duplicate protection
- [x] Active semester rules
- [ ] Complete cascade implementation

## Sprint 3 — Courses

- [x] Course model
- [x] Course validation
- [x] Create course
- [x] List courses
- [x] Filter courses by semester
- [x] Get course
- [x] Update course
- [x] Delete course
- [x] Course ownership
- [x] Duplicate course protection
- [x] Course-to-semester relationship

## Sprint 4 — Assignments

- [x] Assignment model
- [ ] Assignment validation
- [ ] Create assignment
- [ ] List assignments
- [ ] Filter assignments
- [ ] Get assignment
- [ ] Update assignment
- [ ] Delete assignment
- [ ] Assignment cascade deletion
- [ ] Due-date handling

---

# Roadmap

Future versions of Campus Planner are expected to expand beyond the current Semester → Course → Assignment hierarchy.

Potential features include:

- Exams
- Timetable management
- Study schedules
- Course materials
- Academic goals
- Assignment reminders
- Exam reminders
- Dashboard statistics
- Calendar integration
- Notifications
- Search and filtering
- Frontend dashboard
- Responsive mobile UI
- PostgreSQL migration

The backend architecture is intentionally being kept database-agnostic where practical so that moving from MongoDB/Mongoose to PostgreSQL later requires changes primarily within the data-access/model layer rather than throughout the application.

---

# Running the Project

## Requirements

Install:

- Node.js
- npm
- MongoDB

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create an environment file:

```text
.env
```

Example configuration:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_LIFETIME=1d
PORT=5000
```

Start the development server:

```bash
npm run dev
```

---

# Development Philosophy

Campus Planner is being built incrementally rather than attempting to implement the entire application at once.

Each sprint introduces a complete feature area:

```text
Model
  ↓
Validation
  ↓
Service
  ↓
Controller
  ↓
Routes
  ↓
API
  ↓
UI
```

The goal is not only to make the application work, but to practice building software that is:

- Maintainable
- Testable
- Secure
- Modular
- Scalable
- Easy to migrate to another database
- Easy to extend with new academic features

---

# Status

**Campus Planner is currently under active development.**

The authentication, profile, semester, and course foundations have been implemented. Assignment management is the current development area.

---

## License

This project is currently intended as a learning project.
