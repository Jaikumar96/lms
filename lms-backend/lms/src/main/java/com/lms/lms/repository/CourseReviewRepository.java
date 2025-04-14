package com.lms.lms.repository;



import com.lms.lms.model.CourseReview;
import com.lms.lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseReviewRepository extends JpaRepository<CourseReview, Long> {
    List<CourseReview> findByCourse(Course course);
}
