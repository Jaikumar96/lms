package com.lms.lms.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class QuizSubmission {

    private LocalDateTime submittedAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double score;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    public double getScore() {
        return this.score;
    }

    public LocalDateTime getSubmittedAt() {
        return this.submittedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }


    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }


}
