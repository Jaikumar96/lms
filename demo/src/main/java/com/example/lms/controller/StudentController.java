package com.example.lms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
public class StudentController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> studentDashboard() {
        return ResponseEntity.ok("Welcome Student!");
    }
}
