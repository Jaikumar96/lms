package com.example.lms.controller;

import com.example.lms.model.Enrollment;
import com.example.lms.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{id}")
    public Optional<Enrollment> getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id);
    }

    // ❌ Old incorrect method
    // public Enrollment createEnrollment(@RequestBody Enrollment enrollment) { return enrollmentService.createEnrollment(enrollment); }

    // ✅ Corrected method (Accepts studentId & courseId in JSON)
    @PostMapping
    public Enrollment createEnrollment(@RequestBody EnrollmentRequest request) {
        return enrollmentService.createEnrollment(request.getStudentId(), request.getCourseId());
    }

    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }
}

// DTO class to handle JSON request
class EnrollmentRequest {
    private Long studentId;
    private Long courseId;

    public Long getStudentId() {
        return studentId;
    }

    public Long getCourseId() {
        return courseId;
    }
}
