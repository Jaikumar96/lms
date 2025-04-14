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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepo;
    @Autowired private AssignmentSubmissionRepository submissionRepo;
    @Autowired private JwtService jwtService;
    @Autowired private UserRepository userRepo;

    @PostMapping("/submit")
    public ResponseEntity<String> submitAssignment(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request
    ) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User student = userRepo.findByEmail(email).orElseThrow();

        Long assignmentId = Long.parseLong(payload.get("assignmentId"));
        String fileUrl = payload.get("fileUrl");

        Assignment assignment = assignmentRepo.findById(assignmentId).orElseThrow();

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setFileUrl(fileUrl);
        submission.setSubmittedAt(LocalDateTime.now());

        submissionRepo.save(submission);

        return ResponseEntity.ok("Assignment submitted successfully!");
    }
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Map<String, Object>>> getAssignments(
            @PathVariable Long courseId,
            HttpServletRequest request
    ) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);

        List<Assignment> assignments = assignmentRepo.findByCourseId(courseId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Assignment a : assignments) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("title", a.getTitle());
            map.put("description", a.getDescription());
            map.put("dueDate", a.getDueDate());

            Optional<AssignmentSubmission> submission =
                    submissionRepo.findByAssignmentIdAndStudentEmail(a.getId(), email);

            map.put("submitted", submission.isPresent());
            response.add(map);
        }

        return ResponseEntity.ok(response);
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

}
