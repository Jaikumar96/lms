package com.lms.lms.dto;

public class QuestionDTO {
    private Long id;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    // Constructor to accept all arguments
    public QuestionDTO(Long id, String questionText, String optionA, String optionB, String optionC, String optionD) {
        this.id = id;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
    }

    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getOptionB() {
        return optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public String getOptionD() {
        return optionD;
    }
}
