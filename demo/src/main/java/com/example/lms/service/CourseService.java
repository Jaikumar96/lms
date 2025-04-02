package com.example.lms.service;

import com.example.lms.dto.CourseDTO;
import com.example.lms.model.Course;
import com.example.lms.model.User;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "C:/LMS/uploads/courses/";

    public List<CourseDTO> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<CourseDTO> getCourseById(Long id) {
        return courseRepository.findById(id).map(CourseDTO::fromEntity);
    }

    public Course createCourse(String title, String description, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setInstructor(instructor);

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public String uploadMaterial(Long courseId, MultipartFile file) throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Ensure the directory exists
        File courseDir = new File("C:/LMS/uploads/courses/" + courseId);
        if (!courseDir.exists()) {
            courseDir.mkdirs();
        }

        // Save the file
        File destination = new File(courseDir, file.getOriginalFilename());
        file.transferTo(destination);

        // Store the relative path instead of full path
        String fileUrl = "/courses/" + courseId + "/download?file=" + file.getOriginalFilename();

        // Save to the database
        if (course.getMaterialPaths() == null) {
            course.setMaterialPaths(new ArrayList<>());
        }
        course.getMaterialPaths().add(fileUrl);
        courseRepository.save(course);

        return fileUrl; // Return stored file URL
    }

}



