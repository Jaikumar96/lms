package com.example.lms.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;  // Use User instead of Student

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalDate enrolledDate = LocalDate.now();

    // Getters & Setters
}


