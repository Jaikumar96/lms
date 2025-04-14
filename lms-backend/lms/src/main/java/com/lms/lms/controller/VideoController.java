package com.lms.lms.controller;



import com.lms.lms.model.Course;
import com.lms.lms.model.Video;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class VideoController {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping("/{courseId}/videos")
    public ResponseEntity<?> uploadVideoFileToCourse(
            @PathVariable Long courseId,
            @RequestParam("title") String title,
            @RequestParam("order") Integer order,
            @RequestParam(value = "durationMinutes", required = false) Integer durationMinutes,
            @RequestParam("file") MultipartFile file) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty.");
        }

        try {
            // Save file to disk
            String uploadDir = "C:/Users/admin/Downloads/uploads/videos";
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destinationFile = new File(uploadDir, fileName);
            file.transferTo(destinationFile);

            // Create video object
            Video video = new Video();
            video.setTitle(title);
            video.setOrder(order);
            video.setDurationMinutes(durationMinutes);
            video.setVideoUrl("/videos/" + fileName); // this is just a reference path, can adjust
            video.setCourse(course);

            videoRepository.save(video);
            return new ResponseEntity<>(video, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save video.");
        }
    }
    @GetMapping("/{courseId}/videos")
    public ResponseEntity<?> getVideosByCourse(@PathVariable Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        List<Video> videos = videoRepository.findByCourseIdOrderByVideoOrder(courseId);
        return ResponseEntity.ok(videos);
    }



}
