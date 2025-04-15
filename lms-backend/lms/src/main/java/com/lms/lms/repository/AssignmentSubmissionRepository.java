package com.lms.lms.repository;

import com.lms.lms.model.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByStudentEmail(String email);
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentEmail(Long assignmentId, String email);
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);

}
