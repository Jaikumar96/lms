package com.lms.lms.model;

import jakarta.persistence.*;

import java.nio.file.Paths;
import java.time.LocalDateTime;

@Entity
public class AssignmentSubmission {


    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Assignment assignment;

    @Column(name = "file_name")
    private String fileName;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getFileUrl() {
        return fileUrl;
    }


    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    @ManyToOne
    private User student;

    private String fileUrl; // Or text if you store the content
    private LocalDateTime submittedAt;

    public String getFileName() {
        if (fileUrl == null) return null;
        return Paths.get(fileUrl).getFileName().toString();
    }

}

