package com.lms.lms.controller;

import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final UserRepository userRepo;
    private final CourseRepository courseRepo;

    // GET /api/enrollments/student/{studentId}
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getCoursesForStudent(@PathVariable Long studentId) {
        var studentOpt = userRepo.findById(studentId);
        if (studentOpt.isEmpty()) return ResponseEntity.notFound().build();

        var student = studentOpt.get();
        var courses = courseRepo.findByEnrolledStudentsContaining(student);
        return ResponseEntity.ok(courses);
    }

    // GET /api/enrollments/course/{courseId}
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getStudentsInCourse(@PathVariable Long courseId) {
        var courseOpt = courseRepo.findById(courseId);
        if (courseOpt.isEmpty()) return ResponseEntity.notFound().build();

        var course = courseOpt.get();
        return ResponseEntity.ok(course.getEnrolledStudents());
    }

}
