package com.lms.lms.controller;

import com.lms.lms.model.Course;
import com.lms.lms.model.CourseMaterial;
import com.lms.lms.repository.CourseMaterialRepository;
import com.lms.lms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class CourseMaterialController {

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private CourseMaterialRepository materialRepo;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadMaterial(
            @RequestParam("courseId") Long courseId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseMaterial material = new CourseMaterial();
        material.setCourse(course);
        material.setFileName(file.getOriginalFilename());
        material.setFileType(file.getContentType());
        material.setData(file.getBytes());

        materialRepo.save(material);
        return ResponseEntity.ok("File uploaded successfully!");
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<List<CourseMaterial>> getAllMaterials(@PathVariable Long courseId) {
        return ResponseEntity.ok(materialRepo.findByCourseId(courseId));
    }

    @GetMapping("/download/{materialId}")
    public ResponseEntity<byte[]> downloadMaterial(@PathVariable Long materialId) {
        CourseMaterial material = materialRepo.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + material.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(material.getFileType()))
                .body(material.getData());
    }
}
