# Campus Planner Backend

Backend service for Campus Planner, a full-stack academic planning application for university students.

The backend provides the API, authentication, authorization, validation, business logic, and persistence layer for managing users, semesters, courses, assignments, and future academic resources.

---

## 1. Purpose

The backend is responsible for:

- User registration and authentication
- JWT-based authorization
- User profile management
- Semester management
- Course management
- Assignment management
- Request validation
- Business-rule enforcement
- Resource ownership checks
- Database persistence
- Consistent API error handling

The backend is intentionally structured so that business logic is separated from HTTP handling and database models.

---

## 2. Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv

MongoDB and Mongoose are currently used for persistence.

The application is being structured so that a future migration to PostgreSQL can be made with minimal impact on controllers and routes.

---

## 3. Architecture

The backend follows a layered architecture:

```text
Client
  ↓
Routes
  ↓
Middleware
  ↓
Validators
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

Each layer has a specific responsibility.

### Routes

Routes define API endpoints and connect requests to middleware and controllers.

### Middleware

Middleware handles cross-cutting request concerns such as authentication and authorization.

### Validators

Validators process and validate incoming request data before it reaches the controller.

Validated data is passed through:

```javascript
req.validatedData
```

### Controllers

Controllers handle HTTP-level concerns.

A controller should generally:

1. Read request data
2. Read authenticated user information
3. Call a service
4. Return the HTTP response

Controllers should not contain the main business logic.

### Services

Services contain application business logic and database operations.

For example, creating a Course requires checking that the Semester exists and belongs to the authenticated user. That logic belongs in the Course service rather than the controller.

### Models

Mongoose models define database schemas, indexes, relationships, and model-level behavior.

---

## 4. Request Lifecycle

A typical authenticated request follows this flow:

```text
HTTP Request
     ↓
Route
     ↓
Authentication Middleware
     ↓
Request Validator
     ↓
Controller
     ↓
Service
     ↓
Mongoose Model
     ↓
MongoDB
     ↓
Service
     ↓
Controller
     ↓
HTTP Response
```

For example:

```text
PATCH /api/v1/courses/:id
        ↓
authorizeUser
        ↓
updateCourseValidator
        ↓
updateCourse controller
        ↓
courseService.updateCourse()
        ↓
Course model
        ↓
MongoDB
```

---

## 5. Project Structure

The backend follows a modular structure similar to:

```text
backend/
├── src/
│   ├── controllers/
│   ├── errors/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   └── app.js
│
├── .env
├── package.json
└── README.md
```

The structure may evolve as additional resources are introduced.

### controllers/

Contains HTTP request handlers.

Controllers should coordinate requests and responses rather than implement extensive business logic.

### errors/

Contains custom application/API error classes.

Examples include:

```text
BadRequestError
UnauthorizedError
NotFoundError
ConflictError
```

### middleware/

Contains Express middleware.

The authentication middleware verifies JWTs and attaches the authenticated user's ID to:

```javascript
req.user
```

### models/

Contains Mongoose schemas and models.

Current resource models include:

```text
User
Semester
Course
Assignment
```

### routes/

Contains Express route definitions.

Routes connect endpoints to middleware, validators, and controllers.

### services/

Contains business logic and database operations.

Services are intentionally separated from controllers so that database-specific implementation is isolated as much as practical.

### validators/

Contains request validation and normalization logic.

### utils/

Contains reusable helper functions such as:

- Email validation
- Name validation
- MongoDB ObjectId validation
- Date validation
- Academic year validation
- Password validation

---

# 6. Authentication

Campus Planner uses JWT-based authentication.

## Registration

The registration flow is:

```text
Registration Request
        ↓
Registration Validator
        ↓
Validated Data
        ↓
Register Controller
        ↓
User Service
        ↓
User Model
        ↓
Password Hashing
        ↓
MongoDB
```

Passwords are hashed before being stored.

The User model uses a Mongoose `pre('save')` hook so that password hashing is handled at the model layer.

```javascript
UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
});
```

---

## Password Comparison

Password verification is handled through a User model method:

```javascript
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
```

This keeps password comparison logic associated with the User model.

---

## JWT Creation

Authenticated users receive a JWT containing their user ID.

Conceptually:

```javascript
{
    userId: user._id
}
```

The token is created through the User model's `createJWT()` method.

---

## Authorization

Protected routes expect:

```text
Authorization: Bearer <token>
```

The authorization middleware:

1. Checks that the Authorization header exists
2. Checks that it starts with `Bearer `
3. Extracts the token
4. Verifies the JWT
5. Extracts `userId`
6. Attaches the user to `req.user`

Example:

```javascript
req.user = {
    userId
};
```

Invalid or missing authentication results in an unauthorized response.

---

# 7. User Profiles

Authenticated users can retrieve and update their profile.

Current profile operations include:

- Get profile
- Update first name
- Update last name
- Update email
- Change password

Public user information is exposed through a model method such as:

```javascript
user.toPublicProfile()
```

This prevents internal fields such as the password hash from being returned.

---

# 8. Password Changes

Changing a password requires:

```text
oldPassword
newPassword
confirmNewPassword
```

The backend:

1. Finds the authenticated user
2. Retrieves the password hash
3. Verifies the old password
4. Checks that the new password is different
5. Assigns the new password
6. Saves the User document
7. Allows the model hook to hash the new password

Password hashing therefore remains centralized in the User model.

---

# 9. Ownership Model

Campus Planner uses ownership checks throughout the application.

The current ownership hierarchy is:

```text
User
  ↓
Semester
  ↓
Course
  ↓
Assignment
```

Resources contain a `createdBy` field referencing the User.

For example:

```javascript
createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
}
```

Services verify ownership before returning or modifying resources.

Example:

```javascript
const course = await Course.findOne({
    _id: courseId,
    createdBy: userId
});
```

This prevents one authenticated user from accessing another user's resources simply by knowing their resource ID.

---

# 10. Semester

A Semester belongs to a User.

Current fields:

```text
name
academicYear
startDate
endDate
status
createdBy
```

Supported statuses:

```text
upcoming
active
completed
```

Semester validation includes:

- Required fields
- Name validation
- Academic year validation
- Date validation
- End date after start date

The academic year supports formats such as:

```text
2026
2026/2027
```

For an academic year containing two years, the years must be consecutive.

Example:

```text
2026/2027
```

is valid.

```text
2026/2028
```

is invalid.

---

# 11. Course

A Course belongs to a Semester and a User.

Current fields:

```text
name
code
credits
description
semesterId
createdBy
```

Course codes are normalized to uppercase.

For example:

```text
cs341
Cs341
CS341
```

are normalized to:

```text
CS341
```

Course validation currently includes:

- Course name validation
- Course code length validation
- Credit validation
- Description length validation
- Semester ObjectId validation

---

## Course Uniqueness

Courses are unique per user, semester, and course code.

The database index is:

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

This means a user can have:

```text
CS341 in Semester 1
CS341 in Semester 2
```

but cannot have two `CS341` courses in the same semester.

The service layer also performs a duplicate check so the API can return a meaningful conflict error.

---

# 12. Assignment

An Assignment belongs to a Course and a User.

Current fields:

```text
title
description
dueDate
status
priority
courseId
createdBy
```

Supported statuses:

```text
pending
completed
overdue
```

Supported priorities:

```text
low
medium
high
```

Assignments will follow the same ownership pattern:

```text
User
  ↓
Course
  ↓
Assignment
```

Before creating an Assignment, the service should verify that the referenced Course belongs to the authenticated user.

---

# 13. Validation Strategy

The backend uses two levels of validation.

## Application Validation

Incoming requests are validated before reaching controllers.

For example:

```text
Request
  ↓
Validator
  ↓
req.validatedData
  ↓
Controller
```

Validators perform tasks such as:

- Required-field checks
- String trimming
- Case normalization
- Length checks
- Email validation
- Password validation
- ObjectId validation
- Date validation
- Business input validation

---

## Mongoose Validation

Mongoose remains a second layer of protection.

Models define constraints such as:

```javascript
required
maxlength
enum
unique indexes
```

Application-level validation provides clearer API errors, while Mongoose protects the database from invalid documents.

---

# 14. Partial Updates

Update validators support partial updates.

For example, a Course update does not require every Course field.

A request may contain only:

```json
{
    "description": "Updated description"
}
```

The validator builds:

```javascript
req.validatedData
```

with only the fields that should be updated.

This prevents unintended overwriting of existing values.

---

# 15. Empty Values During Updates

Optional fields require special handling.

For example, `description` can intentionally be cleared.

Therefore, the update validator distinguishes between:

```text
Field is missing
```

and:

```text
Field was explicitly provided as an empty string
```

This allows an existing description to be removed intentionally.

---

# 16. Error Handling

The application uses custom API errors to represent HTTP failures.

Common error types include:

```text
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
```

Examples:

### 400 Bad Request

Used when request data is invalid.

```text
Invalid email
Invalid academic year
Invalid course credits
```

### 401 Unauthorized

Used when authentication is missing or invalid.

```text
Authentication invalid
Invalid email or password
Current password is incorrect
```

### 404 Not Found

Used when an owned resource does not exist.

```text
Semester not found
Course not found
```

### 409 Conflict

Used when a resource conflicts with an existing resource.

```text
Course already exists for this semester
```

---

# 17. Resource Lookup Helpers

Services use reusable lookup functions where appropriate.

For example:

```javascript
export const findOwnerCourse = async (userId, courseId) => {
    const course = await Course.findOne({
        _id: courseId,
        createdBy: userId
    });

    if (!course) {
        throw new CustomAPIError.NotFoundError('Course not found');
    }

    return course;
};
```

This prevents repeated ownership logic across multiple Course operations.

The same pattern is used for other resources.

---

# 18. Cascade Deletion

Campus Planner follows a parent-child deletion model.

Current hierarchy:

```text
User
  ↓
Semester
  ↓
Course
  ↓
Assignment
```

Deleting a parent resource should remove resources owned by that parent.

For example:

```text
Delete Semester
      ↓
Delete Courses
      ↓
Delete Assignments
      ↓
Delete other Course-owned resources
```

Likewise:

```text
Delete Course
      ↓
Delete Assignments
      ↓
Delete other Course-owned resources
```

Deleting a child must never delete its parent.

For example:

```text
Delete Course
      ↓
Semester remains
```

As more child resources are introduced, cascade logic will be expanded.

---

# 19. Services and Database Migration

One of the reasons for introducing a service layer is to reduce coupling between HTTP handling and database implementation.

Current architecture:

```text
Controller
    ↓
Service
    ↓
Mongoose
    ↓
MongoDB
```

A future architecture could become:

```text
Controller
    ↓
Service
    ↓
Repository / Data Access
    ↓
PostgreSQL
```

The goal is that controllers and most application-level business logic should not need to know whether the underlying database is MongoDB or PostgreSQL.

The exact migration architecture may evolve as the project grows.

---

# 20. API Conventions

Successful responses generally follow a consistent structure.

Example:

```json
{
    "success": true,
    "course": {
        "courseId": "...",
        "name": "Data Structures",
        "code": "CS341",
        "credits": 3
    }
}
```

Collection responses include the collection and number of results.

Example:

```json
{
    "success": true,
    "courses": [],
    "nbHits": 0
}
```

Public model methods such as:

```javascript
toPublicProfile()
toPublicSemester()
toPublicCourse()
toPublicAssignment()
```

are used to control what resource information is returned to clients.

---

# 21. API Resource Structure

The API is organized around resources.

Current resource areas include:

```text
/api/v1/auth
/api/v1/semesters
/api/v1/courses
/api/v1/assignments
```

Example operations:

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

Course listing supports filtering by semester:

```text
GET /api/v1/courses?semesterId=<semesterId>
```

Assignment endpoints will follow the same resource-oriented approach.

---

# 22. Environment Variables

The backend requires environment-specific configuration.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_LIFETIME=1d
PORT=5000
```

Actual secrets must not be committed to source control.

A local `.env` file should be used during development.

---

# 23. Installation

Clone the project and enter the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
.env
```

Configure the required environment variables.

Start the development server using the project's development script:

```bash
npm run dev
```

The exact scripts may change as the project develops.

---

# 24. Current Backend Progress

## Sprint 1 — Authentication and Profiles

- [x] User model
- [x] Registration
- [x] Registration validation
- [x] Password hashing
- [x] Login
- [x] JWT creation
- [x] Authorization middleware
- [x] Get user profile
- [x] Update profile
- [x] Change password
- [ ] Forgot password
- [ ] Username/profile expansion

## Sprint 2 — Semesters

- [x] Semester model
- [x] Semester validation
- [x] Create semester
- [x] List semesters
- [x] Get semester
- [x] Update semester
- [x] Delete semester
- [x] Ownership checks
- [x] Duplicate protection
- [x] Active semester rules
- [ ] Complete cascade integration

## Sprint 3 — Courses

- [x] Course model
- [x] Course validation
- [x] Create course
- [x] List courses
- [x] Filter courses by semester
- [x] Get course
- [x] Update course
- [x] Delete course
- [x] Ownership checks
- [x] Duplicate protection
- [x] Course-to-semester relationship
- [x] Course cascade integration

## Sprint 4 — Assignments

- [x] Assignment model
- [ ] Assignment validation
- [ ] Create assignment
- [ ] List assignments
- [ ] Filter assignments
- [ ] Get assignment
- [ ] Update assignment
- [ ] Delete assignment
- [ ] Cascade deletion
- [ ] Due-date handling

---

# 25. Development Principles

The backend follows several principles.

## Separation of Concerns

Each layer should have one primary responsibility.

```text
Validator  → Validate input
Controller → Handle HTTP
Service    → Business logic
Model      → Database representation
Middleware → Request processing
```

## Validate Early

Invalid request data should be rejected before entering the controller.

## Verify Ownership

Every protected resource lookup should account for the authenticated user where appropriate.

## Keep Controllers Thin

Business logic should live in services rather than controllers.

## Use Database Constraints

Application checks should be supported by database-level constraints where appropriate.

## Avoid Returning Internal Data

Public model methods control what is exposed to clients.

## Design for Change

The service architecture is intended to reduce future database migration costs.

---

# 26. Future Backend Work

Planned backend areas include:

- Complete Assignment CRUD
- Assignment filtering
- Assignment due-date rules
- Assignment cascade deletion
- Exam management
- Timetable management
- Calendar-related resources
- Notification/reminder infrastructure
- Dashboard aggregation endpoints
- Search and filtering
- Testing
- API documentation
- PostgreSQL migration planning

---

# 27. Status

The Campus Planner backend is under active development.

The authentication, profile, semester, and course foundations are implemented. Assignment management is currently being developed.

The backend architecture is expected to evolve as new academic resources are introduced, while maintaining the separation between routes, validation, controllers, services, and models.

---

# 28. License

This project is currently intended as a learning and portfolio project.

A formal license will be added when the project reaches its appropriate release stage.
