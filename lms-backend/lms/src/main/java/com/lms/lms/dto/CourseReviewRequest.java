package com.lms.lms.dto;


import lombok.Data;

@Data
public class CourseReviewRequest {
    private double rating;
    private String comment;
}
