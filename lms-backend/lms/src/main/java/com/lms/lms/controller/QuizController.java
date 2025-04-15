package com.lms.lms.controller;

import com.lms.lms.dto.QuestionDTO;
import com.lms.lms.dto.QuizDTO;
import com.lms.lms.dto.QuizSubmission;
import com.lms.lms.model.Course;
import com.lms.lms.model.Question;
import com.lms.lms.model.Quiz;
import com.lms.lms.repository.QuizSubmissionRepository;
import com.lms.lms.service.JwtService;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.QuestionRepository;
import com.lms.lms.repository.QuizRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepo;



    @PostMapping("/quizzes")
    public ResponseEntity<String> addQuiz(@RequestBody Quiz quiz, @RequestParam Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        quiz.setCourse(course);

        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }

        quizRepository.save(quiz);
        return ResponseEntity.ok("Quiz added successfully");
    }


    }
    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Convert the questions to QuestionDTO
        List<QuestionDTO> questionDTOs = quiz.getQuestions().stream()
                .map(q -> new QuestionDTO(q.getId(), q.getQuestionText(), q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()))
                .collect(Collectors.toList());

        // Create and return the QuizDTO
        QuizDTO quizDTO = new QuizDTO(quiz.getId(), quiz.getTitle(), quiz.getCourse().getId(), questionDTOs);
        return ResponseEntity.ok(quizDTO);
    }




    @PostMapping("/quizzes/submit")
    public ResponseEntity<Double> submitQuiz(@RequestBody QuizSubmission submission) {
        Map<Long, String> submittedAnswers = submission.getAnswers();
        double totalQuestions = submittedAnswers.size();
        double correct = 0;

        System.out.println("Submitted Answers: " + submittedAnswers);

        for (Map.Entry<Long, String> entry : submittedAnswers.entrySet()) {
            Long questionId = entry.getKey();
            String submittedAnswer = entry.getValue();

            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            System.out.println("Question ID: " + questionId);
            System.out.println("Correct Answer: " + question.getCorrectAnswer());
            System.out.println("Submitted Answer: " + submittedAnswer);

            if (question.getCorrectAnswer().equalsIgnoreCase(submittedAnswer)) {
                correct++;
            }
        }

        double score = (correct / totalQuestions) * 100.0;
        System.out.println("Score: " + score);
        return ResponseEntity.ok(score);
    }


    @Autowired
    private QuestionRepository questionRepository;
}
