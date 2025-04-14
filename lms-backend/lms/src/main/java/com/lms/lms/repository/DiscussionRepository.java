package com.lms.lms.repository;


import com.lms.lms.model.Discussion;
import com.lms.lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    List<Discussion> findByCourse(Course course);
}
