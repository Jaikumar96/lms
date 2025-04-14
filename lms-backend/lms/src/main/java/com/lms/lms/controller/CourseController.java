package com.lms.lms.controller;

import com.lms.lms.model.Course;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/courses") // ✅ added this
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseRepository courseRepo;

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course, Authentication auth) {
        return ResponseEntity.ok(courseService.createCourse(course, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<String> enroll(@PathVariable Long id, Authentication auth) {
        courseService.enrollStudent(id, auth.getName());
        return ResponseEntity.ok("Enrolled successfully");
    }

    @GetMapping("/instructor")
    public ResponseEntity<List<Course>> instructorCourses(Authentication auth) {
        return ResponseEntity.ok(courseService.getCoursesByInstructor(auth.getName()));
    }

    @GetMapping("/student")
    public ResponseEntity<Set<Course>> studentCourses(Authentication auth) {
        return ResponseEntity.ok(courseService.getStudentCourses(auth.getName()));
    }

    // ✅ Search
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String title) {
        return ResponseEntity.ok(courseRepo.findByTitleContainingIgnoreCase(title));
    }

    // ✅ Filter by instructor
    @GetMapping("/filter/instructor")
    public ResponseEntity<List<Course>> filterByInstructor(@RequestParam Long instructorId) {
        return ResponseEntity.ok(courseRepo.findByInstructorId(instructorId));
    }

    // ✅ Filter by price range
    @GetMapping("/filter/price")
    public ResponseEntity<List<Course>> filterByPriceRange(
            @RequestParam Double min,
            @RequestParam Double max) {
        return ResponseEntity.ok(courseRepo.findByPriceBetween(min, max));
    }
}

