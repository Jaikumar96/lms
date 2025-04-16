package com.lms.lms.controller;

import com.lms.lms.dto.QuestionDTO;
import com.lms.lms.dto.QuizDTO;
import com.lms.lms.dto.QuizSubmissionDTO;
import com.lms.lms.model.*;
import com.lms.lms.repository.*;
import com.lms.lms.dto.QuizSubmission;
import com.lms.lms.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuizController {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    @Autowired
    private QuizService quizService;

    // ✅ INSTRUCTOR - Create a quiz with questions
    @PostMapping("/instructor/quizzes")
    public ResponseEntity<String> createQuiz(
            @RequestBody Quiz quiz,
            @RequestParam Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        quiz.setCourse(course);

        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }

        quizRepository.save(quiz);
        return ResponseEntity.ok("Quiz created successfully");
    }

    // ✅ STUDENT - Get quizzes for a course (DTO version)
    @GetMapping("/student/quizzes/{courseId}")
    public ResponseEntity<List<QuizDTO>> getQuizzesForCourse(@PathVariable Long courseId) {
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);

        List<QuizDTO> quizDTOs = quizzes.stream().map(quiz -> {
            QuizDTO quizDTO = new QuizDTO();
            quizDTO.setId(quiz.getId());
            quizDTO.setTitle(quiz.getTitle());
            quizDTO.setCourseId(quiz.getCourse().getId());

            List<QuestionDTO> questionDTOs = quiz.getQuestions().stream().map(q -> {
                QuestionDTO qdto = new QuestionDTO();
                qdto.setId(q.getId());
                qdto.setQuestionText(q.getQuestionText());
                qdto.setOptionA(q.getOptionA());
                qdto.setOptionB(q.getOptionB());
                qdto.setOptionC(q.getOptionC());
                qdto.setOptionD(q.getOptionD());
                return qdto;
            }).toList();

            quizDTO.setQuestions(questionDTOs);
            return quizDTO;
        }).toList();

        return ResponseEntity.ok(quizDTOs);
    }


    // ✅ STUDENT - Submit quiz and get score
    @PostMapping("/student/quizzes/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@RequestBody QuizSubmission submission) {
        Map<Long, String> submittedAnswers = submission.getAnswers();
        double totalQuestions = submittedAnswers.size();
        double correct = 0;

        for (Map.Entry<Long, String> entry : submittedAnswers.entrySet()) {
            Long questionId = entry.getKey();
            String submittedAnswer = entry.getValue();

            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            if (question.getCorrectAnswer().equalsIgnoreCase(submittedAnswer)) {
                correct++;
            }
        }

        double score = (correct / totalQuestions) * 100.0;
        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("correct", (int) correct);
        result.put("total", (int) totalQuestions);

        return ResponseEntity.ok(result);
    }

    // ✅ INSTRUCTOR - Get submissions for a quiz
    @GetMapping("/instructor/quizzes/submissions/{quizId}")
    public ResponseEntity<List<QuizSubmissionDTO>> getQuizSubmissions(@PathVariable Long quizId) {
        List<QuizSubmissionDTO> submissions = quizService.getQuizSubmissions(quizId);
        return ResponseEntity.ok(submissions);
    }

}
