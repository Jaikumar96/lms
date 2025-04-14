package com.lms.lms.controller;

import com.lms.lms.model.Course;
import com.lms.lms.model.QuizSubmission;
import com.lms.lms.model.Role;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.EnrollmentRepository;
import com.lms.lms.repository.QuizSubmissionRepository;
import com.lms.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;


    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> summary = new HashMap<>();

        long totalUsers = userRepo.count();
        long totalStudents = userRepo.countByRole(Role.STUDENT);
        long totalInstructors = userRepo.countByRole(Role.INSTRUCTOR);
        long totalCourses = courseRepo.count();

        summary.put("totalUsers", totalUsers);
        summary.put("totalStudents", totalStudents);
        summary.put("totalInstructors", totalInstructors);
        summary.put("totalCourses", totalCourses);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<Map<String, Object>>> getCourseEnrollments() {
        List<Course> courses = courseRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Course course : courses) {
            Map<String, Object> courseData = new HashMap<>();
            courseData.put("courseTitle", course.getTitle());
            courseData.put("enrollmentCount", course.getEnrolledStudents().size());
            result.add(courseData);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/quiz-performance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getQuizPerformance() {
        List<QuizSubmission> submissions = quizSubmissionRepository.findAll();
        Double averageScore = quizSubmissionRepository.findAverageScore();

        Map<String, Object> response = new HashMap<>();
        response.put("totalSubmissions", submissions.size());
        response.put("averageScore", averageScore != null ? averageScore : 0.0);

        return ResponseEntity.ok(response);
    }

}

