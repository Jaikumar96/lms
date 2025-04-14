package com.lms.lms.model;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Discussion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private LocalDateTime timestamp;

    @ManyToOne
    private User author;

    @ManyToOne
    private Course course;

    @OneToMany(mappedBy = "discussion", cascade = CascadeType.ALL)
    private List<Reply> replies;
}
