package com.example.lms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/instructor")
public class InstructorController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> instructorDashboard() {
        return ResponseEntity.ok("Welcome Instructor!");
    }
}
