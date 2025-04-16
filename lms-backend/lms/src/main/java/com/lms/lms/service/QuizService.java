package com.lms.lms.service;

import com.lms.lms.dto.QuizSubmissionDTO;
import com.lms.lms.model.QuizSubmission;
import com.lms.lms.repository.QuizSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    // Fetch the submissions for a specific quiz
    public List<QuizSubmissionDTO> getQuizSubmissions(Long quizId) {
        List<QuizSubmission> submissions = quizSubmissionRepository.findByQuizId(quizId);
        return submissions.stream()
                .map(submission -> new QuizSubmissionDTO(
                        submission.getStudent().getName(),
                        submission.getScore(),
                        submission.getTotalQuestions(),
                        submission.getCorrectAnswers()))
                .collect(Collectors.toList());
    }
}
