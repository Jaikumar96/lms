package com.lms.lms.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseGradeDto {
    private Long courseId;
    private Double totalScore;
    private String status;
}
