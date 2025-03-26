package com.example.lms.controller;

import com.example.lms.model.Course;
import com.example.lms.model.User;  // ✅ Import the correct User class
import com.example.lms.repository.UserRepository;  // ✅ Import UserRepository
import com.example.lms.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserRepository userRepository;  // ✅ Inject UserRepository

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Optional<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public Course createCourse(@RequestBody Map<String, Object> requestData) {
        String title = (String) requestData.get("title");
        String description = (String) requestData.get("description");
        Long instructorId = ((Number) requestData.get("instructor_id")).longValue();

        // ✅ Fetch instructor from the database
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setInstructor(instructor);  // ✅ Set the instructor correctly

        return courseService.createCourse(course);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}
