package com.lms.lms.repository;



import com.lms.lms.model.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {

    @Query("SELECT q FROM QuizSubmission q WHERE q.student.email = :email")
    List<QuizSubmission> findByStudentEmail(@Param("email") String email);


    @Query("SELECT AVG(qs.score) FROM QuizSubmission qs")
    Double findAverageScore();

    List<QuizSubmission> findByStudentEmailAndCourseId(String email, Long courseId);

    List<QuizSubmission> findByQuizId(Long quizId);
}
