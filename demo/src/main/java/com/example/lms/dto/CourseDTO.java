package com.example.lms.dto;

import com.example.lms.model.Course;
import lombok.Getter;
import lombok.Setter;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CourseDTO {

    private Long id;
    private String title;
    private String description;
    private String instructorUsername;
    private List<String> materialUrls;

    public static CourseDTO fromEntity(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setInstructorUsername(course.getInstructor() != null ? course.getInstructor().getUsername() : "");

        // Use stored URLs
        dto.setMaterialUrls(course.getMaterialPaths() != null ? course.getMaterialPaths() : new ArrayList<>());

        return dto;
    }
}

