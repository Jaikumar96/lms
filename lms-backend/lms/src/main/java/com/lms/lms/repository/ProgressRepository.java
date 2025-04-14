package com.lms.lms.repository;

import com.lms.lms.model.Course;
import com.lms.lms.model.Progress;
import com.lms.lms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByStudent(User student);
    List<Progress> findByCourse(Course course);
}
