package com.lms.lms.controller;



import com.lms.lms.model.Course;
import com.lms.lms.model.Enrollment;
import com.lms.lms.model.QuizSubmission;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.EnrollmentRepository;
import com.lms.lms.repository.QuizSubmissionRepository;
import com.lms.lms.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class DashboardController {

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/student/dashboard")
    public ResponseEntity<Map<String, Object>> studentDashboard(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);

        List<Enrollment> enrollments = enrollmentRepo.findEnrollmentsByStudentEmail(email);
        List<QuizSubmission> submissions = quizSubmissionRepo.findByStudentEmail(email);

        System.out.println("Enrollments fetched: " + enrollments.size());


        int enrolledCourses = enrollments.size();
        int completedCourses = (int) enrollments.stream().filter(Enrollment::isCompleted).count();
        int ongoingCourses = enrolledCourses - completedCourses;

        List<Map<String, Object>> deadlines = new ArrayList<>();
        for (Enrollment e : enrollments) {
            if (e.getCourse().getUpcomingDeadline() != null) {
                Map<String, Object> d = new HashMap<>();
                d.put("courseId", e.getCourse().getId());
                d.put("title", e.getCourse().getUpcomingDeadline().getTitle());
                d.put("dueDate", e.getCourse().getUpcomingDeadline().getDueDate());
                deadlines.add(d);
            }
        }

        List<Map<String, Object>> activity = new ArrayList<>();
        for (QuizSubmission sub : submissions) {
            Map<String, Object> act = new HashMap<>();
            act.put("type", "quiz");
            act.put("score", sub.getScore());
            act.put("courseId", sub.getCourse().getId());
            act.put("date", sub.getSubmittedAt().toLocalDate());
            activity.add(act);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("enrolledCourses", enrolledCourses);
        response.put("completedCourses", completedCourses);
        response.put("ongoingCourses", ongoingCourses);
        response.put("upcomingDeadlines", deadlines);
        response.put("recentActivity", activity);
        System.out.println("Enrollments for " + email + ": " + enrollments.size());
        System.out.println("Student Email: " + email);
        System.out.println("Enrollments fetched: " + enrollments.size());

        return ResponseEntity.ok(response);
    }

    // existing endpoints
    @GetMapping("/home")
    public String home() {
        return "Welcome to LMS Home Page!";
    }

    @GetMapping("/instructor/dashboard")
    public String instructorDashboard() {
        return "Welcome to Instructor Dashboard";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "Welcome to Admin Dashboard";
    }
}
