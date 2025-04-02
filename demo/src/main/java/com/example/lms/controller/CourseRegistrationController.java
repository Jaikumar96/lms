package com.example.lms.controller;

import com.example.lms.model.CourseRegistration;
import com.example.lms.service.CourseRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class CourseRegistrationController {
    @Autowired
    private CourseRegistrationService courseRegistrationService;

    @PostMapping("/{studentId}/register/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> registerCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        String response = courseRegistrationService.registerStudentToCourse(studentId, courseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{studentId}/courses")
    public ResponseEntity<List<CourseRegistration>> getStudentCourses(@PathVariable Long studentId) {
        return ResponseEntity.ok(courseRegistrationService.getStudentCourses(studentId));
    }
}
