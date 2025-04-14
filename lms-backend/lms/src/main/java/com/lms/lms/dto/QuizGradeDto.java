package com.lms.lms.dto;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizGradeDto {
    private Long quizId;
    private String title;
    private Double score;
    private Long courseId;
}
