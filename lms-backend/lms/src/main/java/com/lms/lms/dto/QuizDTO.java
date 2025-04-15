package com.lms.lms.dto;

import java.util.List;

public class QuizDTO {
    private Long id;
    private String title;
    private Long courseId;
    private List<QuestionDTO> questions;

    public QuizDTO(Long id, String title, Long courseId, List<QuestionDTO> questions) {
        this.id = id;
        this.title = title;
        this.courseId = courseId;
        this.questions = questions;
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

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }
}
