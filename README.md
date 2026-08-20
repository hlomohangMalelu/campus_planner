# Campus Planner

Campus Planner is a backend-focused academic planning system designed to help students organize their university academic information in one place.

The project is being developed incrementally, with an emphasis on clean backend architecture, validation, ownership rules, maintainability, and reusable components.

> **Project status:** In active development.

---

## Overview

Campus Planner is intended to manage academic information such as:

- User accounts and authentication
- Academic semesters
- Courses
- Assignments
- Exams
- Timetables
- Other academic planning data as the project grows

The backend is being designed around clear separation of responsibilities:

```text
Request
   │
   ▼
Controller
   │
   ▼
Validator
   │
   ▼
Service
   │
   ▼
Model / Database
```

This separation keeps input validation, business rules, and database operations from becoming tightly coupled.

---

## Core Design Principles

### 1. Validate before business logic

Validators are responsible for checking whether incoming data has the correct shape and format.

For example, the Course validator is responsible for validating:

- Course name
- Course code
- Credits
- Description
- Semester ObjectId

The validator should not determine whether a referenced semester actually exists or belongs to the authenticated user. Those are service-layer responsibilities. This boundary is part of the current Course architecture. fileciteturn1file1

---

### 2. Services contain business rules

After validation, the service layer performs operations that require knowledge of the database or application rules.

For Course creation, the planned flow is:

```text
createCourse(userId, courseData)
        │
        ├── Find semester using:
        │      semesterId + userId
        │
        ├── If semester does not exist
        │      └── return 404
        │
        ├── Check for duplicate course:
        │      userId + semesterId + code
        │
        ├── If duplicate
        │      └── return an error
        │
        └── Create Course
```

This establishes the parent-child ownership rule: a user can only create a Course under a Semester that belongs to that user. fileciteturn1file0

---

### 3. Shared validation utilities

Generic validation logic should be reusable.

For example:

```text
validators/
├── utils.js
├── auth.validator.js
├── semester.validator.js
└── course.validator.js
```

`validateMongooseId()` belongs in shared utilities because it can be reused by resources such as Courses, Assignments, Exams, and Timetables.

Course-specific validation such as `validateCode()` and `validateCredits()` remains in the Course validator unless it becomes useful elsewhere. fileciteturn1file0

---

## Validation

### Course code

Course codes are:

1. Trimmed
2. Converted to uppercase
3. Required to be between 3 and 20 characters

Example:

```text
" cs3410 " → "CS3410"
```

The length check uses an OR condition:

```javascript
if (code?.length < 3 || code?.length > 20) {
    throw new BadRequestError(
        'Course code must be between 3 to 20 characters'
    );
}
```

---

### Course credits

Credits are converted using `Number()` rather than `parseFloat()` so that invalid values such as:

```text
"3abc"
```

are not silently converted into:

```text
3
```

The intended validation is:

```javascript
const parsedCredits = Number(credits);

if (!Number.isFinite(parsedCredits)) {
    throw new BadRequestError(
        'Please provide a valid value for credits'
    );
}

if (parsedCredits < 1) {
    throw new BadRequestError(
        'Credits must be greater than or equal to 1'
    );
}

return parsedCredits;
```

This accepts numeric strings such as `"3"` and `"3.5"` while rejecting invalid numeric input. fileciteturn1file0

---

### Description

Descriptions are optional.

For creation, an omitted or empty description can simply mean that no description was supplied.

For updates, however, the API distinguishes between:

| Request | Meaning |
|---|---|
| `{}` | Keep the existing description |
| `{"description": "New description"}` | Replace the description |
| `{"description": ""}` | Remove the description |

Therefore, PATCH validation should check whether the property was actually supplied:

```javascript
if (Object.hasOwn(req.body, 'description')) {
    validatedData.description = validateDescription(description);
}
```

This prevents an empty string from being accidentally treated the same as an omitted field. fileciteturn1file5

---

## Error Handling

The project uses application-specific errors such as:

```javascript
BadRequestError
```

Validation errors should be raised deliberately rather than relying on database casting errors.

For example, an invalid `semesterId` should be checked by:

```javascript
validateMongooseId(semesterId, 'Semester');
```

before the value reaches Mongoose.

This keeps malformed request errors separate from database/business-rule errors.

---

## Project Structure

The backend follows a modular structure similar to:

```text
project/
├── controllers/
├── errors/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
│   ├── utils.js
│   ├── auth.validator.js
│   ├── semester.validator.js
│   └── course.validator.js
├── app.js
└── server.js
```

The exact structure may evolve as new modules are introduced.

---

## Academic Data Relationships

The academic portion of the application is being designed around parent-child relationships.

A simplified relationship is:

```text
User
 │
 └── Semester
       │
       ├── Course
       │    ├── Assignment
       │    └── Exam
       │
       └── other academic resources
```

The important rule is that ownership must be checked through the parent relationship.

For example:

```text
User
 │
 └── Semester
       │
       └── Course
```

A valid Course request is not enough on its own. The service must also verify that the referenced Semester belongs to the authenticated User. fileciteturn1file0

---

## PATCH Semantics

Update endpoints should use partial-update semantics.

A missing property means:

```text
Do not change it.
```

A supplied property means:

```text
Validate it and update it.
```

For optional fields such as `description`, an explicitly supplied empty value can be meaningful.

Example:

```json
{}
```

means:

```text
Keep everything unchanged.
```

Whereas:

```json
{
  "description": ""
}
```

means:

```text
Clear the description.
```

This distinction should be preserved throughout the validator → service → model flow. fileciteturn1file5

---

## Development Workflow

New resources should generally follow this sequence:

```text
1. Design the model
       ↓
2. Define validation rules
       ↓
3. Create validator
       ↓
4. Create service
       ↓
5. Implement controller
       ↓
6. Add routes
       ↓
7. Test success cases
       ↓
8. Test validation failures
       ↓
9. Test ownership/business rules
       ↓
10. Test update/delete edge cases
```

The project prioritizes getting the architecture right before adding more features.

---

## Current Development Focus

The current academic-planning development is moving from the completed authentication foundation into academic resources.

The Course module is establishing several patterns that will be reused throughout the project:

- Reusable Mongoose ObjectId validation
- Resource-specific validators
- Service-level ownership checks
- Parent-child relationships
- Duplicate detection
- Clear separation between validation and business logic
- Correct PATCH semantics

These patterns are expected to apply to later resources such as Assignments, Exams, and Timetables. fileciteturn1file0

---

## Example Course Validation Flow

A Course creation request can be thought of as:

```text
HTTP Request
     │
     ▼
Authentication
     │
     ▼
Course Validator
     │
     ├── name
     ├── code
     ├── credits
     ├── description
     └── semesterId
     │
     ▼
Course Service
     │
     ├── semester exists?
     ├── semester belongs to user?
     ├── duplicate course?
     └── create course
     │
     ▼
Course Model
     │
     ▼
Database
```

The key architectural distinction is:

```text
Validator = "Is this input valid?"

Service = "Is this operation allowed?"

Model/Database = "Can this data be persisted?"
```

---

## Goals

The long-term goal is to build Campus Planner into a maintainable academic management system rather than simply a collection of CRUD endpoints.

Important goals include:

- Clean architecture
- Strong validation
- Consistent error handling
- Secure user ownership
- Reusable utilities
- Predictable REST API behavior
- Maintainable database models
- Clear separation of concerns
- Incremental development and testing

---

## Project Status

Campus Planner is currently under active development.

The project is being built incrementally, with authentication already established and the academic domain being implemented resource by resource.

The Course module is currently helping establish the architecture and rules that will be reused by subsequent academic modules.
