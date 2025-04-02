package com.example.lms.repository;

import com.example.lms.model.CourseRegistration;
import com.example.lms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {

    // ✅ Make sure the parameter type is `com.example.lms.model.User`
    List<CourseRegistration> findByStudent(User student);
}

