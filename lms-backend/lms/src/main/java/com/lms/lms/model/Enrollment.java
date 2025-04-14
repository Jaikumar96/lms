package com.lms.lms.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;


    @ManyToOne
    private Course course;

    @Column(name = "completed")
    private boolean completed;


    private LocalDateTime enrolledAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Enrollment(Long id, LocalDateTime enrolledAt, Course course, User student) {
        this.id = id;
        this.enrolledAt = enrolledAt;
        this.course = course;
        this.student = student;
    }
    public boolean isCompleted() {
        return this.completed; // Assuming you have a field like `private boolean completed;`
    }

}
