package com.lms.lms.controller;



import com.lms.lms.model.Course;
import com.lms.lms.model.User;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.UserRepository;
import com.lms.lms.service.CertificateService;
import com.lms.lms.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/courses")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/{courseId}/certificate")
    public ResponseEntity<InputStreamResource> downloadCertificate(@PathVariable Long courseId, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User student = userRepo.findByEmail(email).orElseThrow();

        Course course = courseRepo.findById(courseId).orElseThrow();

        // You can add logic here to check if student has completed course

        ByteArrayInputStream in = certificateService.generateCertificate(student, course);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=certificate.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
