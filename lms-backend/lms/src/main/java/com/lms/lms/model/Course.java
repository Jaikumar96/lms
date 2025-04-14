package com.lms.lms.model;

import jakarta.persistence.*;
import jakarta.persistence.Id;


import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double price;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;

    @ManyToMany
    @JoinTable(
            name = "course_student",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<User> enrolledStudents = new HashSet<>();

    // ==== GETTERS AND SETTERS ====
    @Transient
    public Deadline getUpcomingDeadline() {
        return new Deadline("Math Quiz", LocalDate.now().plusDays(5));
    }

    public static class Deadline {
        private String title;
        private LocalDate dueDate;

        public Deadline(String title, LocalDate dueDate) {
            this.title = title;
            this.dueDate = dueDate;
        }

        public String getTitle() {
            return title;
        }

        public LocalDate getDueDate() {
            return dueDate;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public User getInstructor() {
        return instructor;
    }

    public void setInstructor(User instructor) {
        this.instructor = instructor;
    }

    public Set<User> getEnrolledStudents() {
        return enrolledStudents;
    }

    public void setEnrolledStudents(Set<User> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }
}
