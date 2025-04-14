package com.lms.lms.controller;

import com.lms.lms.config.JwtUtil;
import com.lms.lms.dto.ResetPasswordRequest;
import com.lms.lms.model.Role;


import com.lms.lms.model.User;
import com.lms.lms.repository.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Allows student/instructor/admin to register.")
    @ApiResponse(responseCode = "200", description = "Successfully registered")
    @ApiResponse(responseCode = "400", description = "User already exists")
    public String register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "User already exists!";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        return "User registered successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok("Bearer " + token);
    }
    @PostMapping("auth/password/reset-request")
    public ResponseEntity<String> requestReset(@RequestParam String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optionalUser.get();
        String token = UUID.randomUUID().toString(); // generate reset token
        user.setResetToken(token);
        userRepository.save(user);

        // In real app, send email here
        return ResponseEntity.ok("Reset token: " + token); // temp: show in response
    }
    @PostMapping("auth/password/reset")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<User> optionalUser = userRepository.findByResetToken(request.getToken());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null); // clear token after use
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully!");
    }



}


@Data
class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}

@Data
class LoginRequest {
    private String email;
    private String password;
}

