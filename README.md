# Campus Planner

> A modern academic planning platform designed to help university students organize their academic life in one place.

Campus Planner is a full-stack application designed to bring a student's academic information together into one organized platform.

Instead of keeping semesters, courses, assignments, exams, timetables, and study plans in separate places, Campus Planner connects them into a single academic workspace.

---

##  Overview

The core academic structure is:

```text
Student
   │
   └── Semester
        │
        └── Course
             │
             ├── Assignments
             ├── Exams
             ├── Timetable
             └── Other academic activities
```

A student can create a semester, add courses to it, and then attach academic activities to those courses.

The long-term goal is to turn Campus Planner into a student's personal **academic command center**.

---

## The Problem

University students often manage academic information using a mixture of:

- Notes
- Paper
- Spreadsheets
- Calendar applications
- Messaging applications
- Learning management systems
- Personal reminders

These tools may solve individual problems, but they do not necessarily provide one centralized view of a student's academic life.

Campus Planner aims to provide that centralized experience.

---

## Vision

A student should be able to open Campus Planner and quickly understand:

```text
What semester am I in?
        ↓
What courses am I taking?
        ↓
What assignments are due?
        ↓
What exams are coming?
        ↓
What does my timetable look like?
        ↓
What should I work on next?
```

---

# Core Features

## Authentication & Profiles

Students can create and securely access their accounts.

Current authentication functionality includes:

- Registration
- Login
- Password hashing
- JWT-based authentication
- Protected resources
- Profile management
- Password changes

---

## Semester Management

Students can create and manage their academic semesters.

A semester contains information such as:

- Semester name
- Academic year
- Start date
- End date
- Status

Example:

```text
Semester 1
2026/2027
January → June
Active
```

---

## Course Management

Courses belong to specific semesters.

Students can manage:

- Course name
- Course code
- Credits
- Description

Example:

```text
Semester 1
│
├── CS3400 — Data Structures
├── CS3520 — Computer Organisation
├── CS3541 — Computer Networks
└── CS4433 — Software Engineering
```

---

## Assignment Management

Assignments belong to courses.

Students can track:

- Assignment title
- Description
- Due date
- Priority
- Completion status

Assignments support:

```text
Status:
- Pending
- Completed
- Overdue

Priority:
- Low
- Medium
- High
```

---

# Planned Features

### Exams

- Exam dates
- Exam venues
- Exam status
- Exam preparation tracking

### Timetable

- Weekly timetable
- Lecture schedules
- Practical/lab sessions
- Venues
- Clash detection

### Academic Calendar

A centralized calendar for:

- Assignment deadlines
- Exams
- Important academic dates
- Semester dates

### Dashboard

The dashboard will provide a quick academic overview:

```text
┌─────────────────────────────────────┐
│          CAMPUS PLANNER             │
├─────────────────────────────────────┤
│ Current Semester                    │
│ Semester 1 — 2026/2027             │
│                                     │
│ Courses        Assignments    Exams │
│    6                12           4  │
│                                     │
│ Upcoming                            │
│                                     │
│ CS341  Assignment 2     Tomorrow    │
│ CS352  Lab Report       Friday      │
│ CS354  Test             Monday      │
└─────────────────────────────────────┘
```

### Notifications & Reminders

Potential reminders for:

- Upcoming assignments
- Approaching exams
- Overdue work
- Important academic dates

### Study Planning

Future study-planning features may include:

- Study sessions
- Study goals
- Revision plans
- Course-specific study schedules

---

# Application Architecture

Campus Planner is being developed as a full-stack application:

```text
Campus Planner
│
├── Frontend
│    └── User Interface
│
├── Backend
│    └── REST API
│
└── Database
     └── Application Data
```

At a high level:

```text
                    ┌──────────────────┐
                    │      Student     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Frontend UI   │
                    └────────┬─────────┘
                             │
                         HTTP / API
                             │
                             ▼
                    ┌──────────────────┐
                    │     Backend      │
                    │    REST API      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Database     │
                    └──────────────────┘
```

---

# Academic Data Model

The core relationship is:

```text
User
 │
 ├── Profile
 │
 └── Semesters
       │
       └── Courses
             │
             ├── Assignments
             ├── Exams
             ├── Timetable Entries
             └── Other Resources
```

This hierarchical structure keeps academic information connected.

For example:

```text
Assignment
    ↓
Course
    ↓
Semester
    ↓
Student
```

---

# Ownership & Privacy

Academic resources belong to the student who created them.

The ownership hierarchy is:

```text
Student
   ↓
Semester
   ↓
Course
   ↓
Assignment
```

Students should only be able to access and modify resources belonging to their own account.

This principle is enforced throughout the application.

---

# Technology

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

### Frontend

A dedicated frontend/UI is being developed for the Campus Planner application.

The frontend technology may evolve as development continues.

### Database Direction

MongoDB is currently being used during development.

The backend architecture is being designed with future database flexibility in mind, with PostgreSQL being a possible future production direction.

---

# Development Approach

Campus Planner is being developed incrementally through development sprints.

Each feature follows a progression similar to:

```text
Feature
   ↓
Data Model
   ↓
Validation
   ↓
Business Logic
   ↓
API
   ↓
UI
   ↓
Testing
```

The goal is not only to make the application work, but to build it using maintainable and scalable software-development practices.

---


# Roadmap

```text
Authentication
      ↓
Semesters
      ↓
Courses
      ↓
Assignments
      ↓
Exams
      ↓
Timetable
      ↓
Calendar
      ↓
Dashboard
      ↓
Study Planning
      ↓
Notifications
```

The roadmap may evolve as the application develops.

---

# UI Direction

The UI is intended to focus on the student's most important information rather than presenting a collection of disconnected CRUD pages.

The planned dashboard experience is:

```text
Dashboard
│
├── Current Semester
├── Courses
├── Upcoming Assignments
├── Upcoming Exams
├── Today's Schedule
└── Academic Overview
```

The goal is to make common academic tasks quick and easy to access.

---

> **Project Status:** Campus Planner is currently under active development.



The authentication, profile, semester, and course foundations have been implemented. Assignment management is currently being developed.

Campus Planner is being built as both:

1. A practical academic planning platform
2. A portfolio project demonstrating full-stack software development

---

# Project Goals

The project is intended to demonstrate practical experience with:

- Full-stack application development
- REST API design
- Authentication and authorization
- Database modeling
- Data validation
- Service-layer architecture
- Resource ownership
- Error handling
- CRUD operations
- Hierarchical data modeling
- Frontend development
- Software architecture
- Database migration planning

---

# Contributing

Campus Planner is currently being developed as an individual learning project.

Contribution guidelines may be added as the project matures.

---

# License

This project is currently intended as a learning project.

A formal license will be added when the project reaches its appropriate release stage.
