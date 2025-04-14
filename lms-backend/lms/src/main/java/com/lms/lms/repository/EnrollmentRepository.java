package com.lms.lms.repository;

import com.lms.lms.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    @Query("SELECT e FROM Enrollment e JOIN e.student s WHERE s.email = :email")
    List<Enrollment> findEnrollmentsByStudentEmail(@Param("email") String email);
}
