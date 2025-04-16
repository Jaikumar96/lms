package com.lms.lms.controller;

import com.lms.lms.model.Assignment;
import com.lms.lms.model.AssignmentSubmission;
import com.lms.lms.model.Course;
import com.lms.lms.model.User;
import com.lms.lms.repository.AssignmentRepository;
import com.lms.lms.repository.AssignmentSubmissionRepository;
import com.lms.lms.repository.UserRepository;
import com.lms.lms.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepo;
    @Autowired private AssignmentSubmissionRepository submissionRepo;
    @Autowired private JwtService jwtService;
    @Autowired private UserRepository userRepo;

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> submitAssignment(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) throws IOException {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User student = userRepo.findByEmail(email).orElseThrow();

        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with ID: " + assignmentId));

        // Save file to disk
        String uploadDir = "C:\\Users\\admin\\Downloads\\uploads\\assignments";
        Files.createDirectories(Paths.get(uploadDir));

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save submission info
        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setFileUrl(filePath.toString());
        submission.setSubmittedAt(LocalDateTime.now());

        submissionRepo.save(submission);

        return ResponseEntity.ok("Assignment submitted successfully!");
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Map<String, Object>>> getAssignmentsByCourse(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentRepo.findByCourseId(courseId);

        List<Map<String, Object>> response = assignments.stream().map(assignment -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", assignment.getId());
            map.put("title", assignment.getTitle());
            map.put("description", assignment.getDescription());
            map.put("dueDate", assignment.getDueDate());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/submissions/{assignmentId}")
    public ResponseEntity<List<Map<String, Object>>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        List<AssignmentSubmission> submissions = submissionRepo.findByAssignmentId(assignmentId);

        List<Map<String, Object>> result = submissions.stream().map(sub -> {
            Map<String, Object> map = new HashMap<>();
            map.put("submissionId", sub.getId());
            map.put("studentName", sub.getStudent().getName());
            map.put("studentEmail", sub.getStudent().getEmail());
            map.put("submittedAt", sub.getSubmittedAt());
            map.put("fileUrl", "http://localhost:8080/assignments/files/" + sub.getFileName());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }


    @PostMapping("/create")
    public ResponseEntity<String> createAssignment(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request
    ) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User user = userRepo.findByEmail(email).orElseThrow(); // no role check now

        String title = payload.get("title");
        String description = payload.get("description");
        LocalDate dueDate = LocalDate.parse(payload.get("dueDate"));
        Long courseId = Long.parseLong(payload.get("courseId"));

        Course course = new Course();
        course.setId(courseId);

        Assignment assignment = new Assignment();
        assignment.setTitle(title);
        assignment.setDescription(description);
        assignment.setDueDate(dueDate);
        assignment.setCourse(course); // minimal reference

        assignmentRepo.save(assignment);

        return ResponseEntity.ok("Assignment created successfully!");
    }

    @GetMapping("/files/{fileName}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName) throws IOException {
        Path filePath = Paths.get("C:\\Users\\admin\\Downloads\\uploads\\assignments", fileName);
        byte[] fileBytes = Files.readAllBytes(filePath);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }



}
