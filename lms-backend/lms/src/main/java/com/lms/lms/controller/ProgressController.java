package com.lms.lms.controller;

import com.lms.lms.model.Progress;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.ProgressRepository;
import com.lms.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressRepository progressRepo;
    private final UserRepository userRepo;
    private final CourseRepository courseRepo;

    // POST /api/progress
    @PostMapping
    public ResponseEntity<?> addProgress(@RequestBody Progress progress) {
        return ResponseEntity.ok(progressRepo.save(progress));
    }

    // GET /api/progress/student/{studentId}
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudent(@PathVariable Long studentId) {
        var studentOpt = userRepo.findById(studentId);
        if (studentOpt.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(progressRepo.findByStudent(studentOpt.get()));
    }

    // GET /api/progress/course/{courseId}
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getByCourse(@PathVariable Long courseId) {
        var courseOpt = courseRepo.findById(courseId);
        if (courseOpt.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(progressRepo.findByCourse(courseOpt.get()));
    }
}

