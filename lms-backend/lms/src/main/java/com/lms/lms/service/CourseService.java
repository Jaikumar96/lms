package com.lms.lms.service;

import com.lms.lms.model.Course;
import com.lms.lms.model.User;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private UserRepository userRepo;

    public Course createCourse(Course course, String instructorEmail) {
        User instructor = userRepo.findByEmail(instructorEmail).orElseThrow();
        course.setInstructor(instructor);
        return courseRepo.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepo.findById(id).orElseThrow();
    }

    public List<Course> getCoursesByInstructor(String email) {
        return courseRepo.findByInstructorEmail(email);
    }

    public void enrollStudent(Long courseId, String studentEmail) {
        Course course = courseRepo.findById(courseId).orElseThrow();
        User student = userRepo.findByEmail(studentEmail).orElseThrow();
        course.getEnrolledStudents().add(student);
        courseRepo.save(course);
    }

    public Set<Course> getStudentCourses(String studentEmail) {
        User student = userRepo.findByEmail(studentEmail).orElseThrow();
        return student.getEnrolledCourses();
    }
}
