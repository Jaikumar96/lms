package com.lms.lms.dto;

public class QuizDTO {
    private Long id;
    private String title;
    private Long courseId;

    public QuizDTO(Long id, String title, Long courseId) {
        this.id = id;
        this.title = title;
        this.courseId = courseId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Long getCourseId() {
        return courseId;
    }
}
