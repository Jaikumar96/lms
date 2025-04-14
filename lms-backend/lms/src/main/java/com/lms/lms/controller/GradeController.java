package com.lms.lms.controller;

import com.lms.lms.dto.QuizGradeDto;
import com.lms.lms.dto.CourseGradeDto;
import com.lms.lms.model.QuizSubmission;
import com.lms.lms.repository.QuizSubmissionRepository;
import com.lms.lms.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GradeController {

    private final QuizSubmissionRepository quizSubmissionRepo;
    private final JwtService jwtService;

    @GetMapping("/quizzes/grades")
    public List<QuizGradeDto> getQuizGrades(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);

        List<QuizSubmission> submissions = quizSubmissionRepo.findByStudentEmail(email);

        return submissions.stream().map(sub -> new QuizGradeDto(
                sub.getQuiz().getId(),
                sub.getQuiz().getTitle(),
                sub.getScore(),
                sub.getCourse().getId()
        )).collect(Collectors.toList());
    }

    @GetMapping("/courses/{courseId}/grade")
    public CourseGradeDto getCourseGrade(@PathVariable Long courseId, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);

        List<QuizSubmission> submissions = quizSubmissionRepo.findByStudentEmailAndCourseId(email, courseId);

        double totalScore = submissions.stream()
                .mapToDouble(QuizSubmission::getScore)
                .average()
                .orElse(0.0);

        String status = totalScore >= 50 ? "Passed" : "In Progress";

        return new CourseGradeDto(courseId, totalScore, status);
    }
}
