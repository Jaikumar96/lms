package com.example.lms.service;

import com.example.lms.model.Course;
import com.example.lms.model.CourseRegistration;
import com.example.lms.model.User;
import com.example.lms.repository.CourseRegistrationRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseRegistrationService {
    private static final Logger logger = LoggerFactory.getLogger(CourseRegistrationService.class);

    @Autowired
    private CourseRegistrationRepository courseRegistrationRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String registerStudentToCourse(Long studentId, Long courseId) {
        logger.info("Registering student with ID: {}", studentId);
        logger.info("Registering for course with ID: {}", courseId);

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        logger.info("Found student: {}", student.getUsername());

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        logger.info("Found course: {}", course.getTitle());

        CourseRegistration registration = new CourseRegistration();
        registration.setStudent(student);
        registration.setCourse(course);

        courseRegistrationRepository.save(registration);
        logger.info("Student {} registered for course {}", student.getUsername(), course.getTitle());

        return "Student registered for course successfully!";
    }
    public List<CourseRegistration> getStudentCourses(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return courseRegistrationRepository.findByStudent(student);
    }
}
