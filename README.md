# Online Learning Management System (LMS) - Backend

## Project Overview
This is the backend for an Online Learning Management System (LMS) that provides course management, user authentication, and progress tracking.

## Technologies Used
- **Programming Language:** Java 17  
- **Framework:** Spring Boot  
- **Database:** MySQL  
- **Security:** Spring Security, JWT  
- **Testing:** JUnit, Mockito  
- **API Testing:** Postman  

## Features
- User roles: Admin, Instructor, Student  
- Secure authentication with JWT  
- Course management (CRUD operations)  
- Enrollment & quiz functionality  
- Role-based access control  

## Project Structure

lms-backend/
│── src/
│   ├── main/java/com/example/lms/
│   │   ├── controllers/        # REST API Controllers
│   │   ├── services/           # Business Logic
│   │   ├── repositories/       # Database Operations
│   │   ├── models/             # Entity Models
│   ├── main/resources/
│   │   ├── application.properties  # Database Configuration
│── pom.xml                      # Maven Dependencies
│── README.md                     # Project Documentation

## 🔧 Setup & Installation
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/lms-backend.git

2. Navigate to the project folder:
   ```bash
   cd lms-backend

4. Configure application.properties with your MySQL database details.

5. Run the project using:  
   ```bash
   mvn spring-boot:run
