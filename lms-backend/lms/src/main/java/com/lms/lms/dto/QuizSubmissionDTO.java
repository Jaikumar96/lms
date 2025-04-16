package com.lms.lms.dto;

public class QuizSubmissionDTO {

    private String studentName;
    private double score;
    private int totalQuestions;
    private int correctAnswers;

    public QuizSubmissionDTO(String studentName, double score, int totalQuestions, int correctAnswers) {
        this.studentName = studentName;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    // Getters and Setters
}

