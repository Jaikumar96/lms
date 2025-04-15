# Online Learning Management System (LMS)

## WEEK 03 - Internship Project

An Online Learning Management System (LMS) helps manage courses, students, instructors, and assessments. This project simulates a real-world learning platform with features like course registration, user role management, progress tracking, and quiz handling.

## Technologies Used

### Backend
- Language: Java 17
- Framework: Spring Boot
- Database: MySQL / PostgreSQL
- Testing: JUnit, Mockito

### Frontend
- Framework: React.js

### Tools
- Postman
- Git & GitHub

## Installation & Running the Project

### Backend (Spring Boot)

1. Open terminal and run:
   
```bash
cd lms-backend/lms

2. Start the backend server:

```bash
mvn spring-boot:run


> Note: Make sure your MySQL/PostgreSQL service is running and the database configuration is correctly set in the `application.properties` file.

### Frontend (React.js)

1. Open a new terminal and run:

```bash
cd lms-frontend


2. Install dependencies:

```bash
npm install


3. Start the frontend development server:

```bash
npm run dev

## Testing

- Backend testing is implemented using JUnit and Mockito.
- API endpoints are tested using Postman.

## Features Implemented

- User roles: Admin, Student, Instructor
- Course registration and management
- User progress tracking
- Quiz management system
- Frontend portal for admin and students
