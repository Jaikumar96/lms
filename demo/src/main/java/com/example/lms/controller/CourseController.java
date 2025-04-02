package com.example.lms.controller;

import com.example.lms.dto.CourseDTO;
import com.example.lms.model.Course;
import com.example.lms.model.User;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.UserRepository;
import com.example.lms.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
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
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;  // ✅ Fixed repository issue

    /**
     * Get all courses with pagination and sorting.
     */
    @GetMapping
    public List<CourseDTO> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "title") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return courseService.getAllCourses(pageable);
    }

    /**
     * Get a specific course by ID.
     */
    @GetMapping("/{id}")
    public Optional<CourseDTO> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    /**
     * Create a new course.
     */
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Map<String, Object> requestData) {
        try {
            String title = (String) requestData.get("title");
            String description = (String) requestData.get("description");
            Long instructorId = ((Number) requestData.get("instructor_id")).longValue();

            User instructor = userRepository.findById(instructorId)
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));

            Course course = new Course();
            course.setTitle(title);
            course.setDescription(description);
            course.setInstructor(instructor);

            CourseDTO createdCourse = CourseDTO.fromEntity(courseService.createCourse(title, description, instructorId.longValue()));
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating course: " + e.getMessage());
        }
    }

    /**
     * Upload course material.
     */
    @PostMapping("/{id}/uploadMaterial")
    public ResponseEntity<?> uploadCourseMaterial(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            String filePath = courseService.uploadMaterial(id, file);
            return ResponseEntity.ok("File uploaded successfully! Saved at: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Download course material.
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long id, @RequestParam String file) throws IOException {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        File targetFile = new File("C:/LMS/uploads/courses/" + id + "/" + file);

        if (!targetFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Create a resource from the file
        Resource resource = new UrlResource(targetFile.toURI());

        // Get the content type
        String contentType = Files.probeContentType(targetFile.toPath());
        if (contentType == null) {
            contentType = "application/octet-stream";  // Default type
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file + "\"")
                .body(resource);
    }


    /**
     * Delete a course.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok("Course deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error deleting course: " + e.getMessage());
        }
    }
}
