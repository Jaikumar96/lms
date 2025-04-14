package com.lms.lms.repository;

import com.lms.lms.model.Course;
import com.lms.lms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructorEmail(String email);
    List<Course> findByEnrolledStudentsContaining(User student);
    // Search by title (case-insensitive, partial match)
    List<Course> findByTitleContainingIgnoreCase(String title);

    // Filter by instructor ID
    List<Course> findByInstructorId(Long instructorId);

    // Optional: Filter by price range
    List<Course> findByPriceBetween(Double min, Double max);

}
