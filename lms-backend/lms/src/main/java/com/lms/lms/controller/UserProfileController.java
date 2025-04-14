package com.lms.lms.controller;

import com.lms.lms.dto.ResetPasswordRequest;
import com.lms.lms.dto.UserProfileDTO;
import com.lms.lms.model.User;
import com.lms.lms.repository.UserRepository;
import com.lms.lms.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;




    @PutMapping
    public ResponseEntity<String> updateProfile(@RequestBody UserProfileDTO profileDTO,
                                                HttpServletRequest request) {
        String token = jwtService.extractTokenFromRequest(request);
        String userEmail = jwtService.extractUsername(token);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(profileDTO.getName());
        user.setEmail(profileDTO.getEmail());

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile(HttpServletRequest request) {
        String token = jwtService.extractTokenFromRequest(request);
        String userEmail = jwtService.extractUsername(token);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileDTO profileDTO = new UserProfileDTO();
        profileDTO.setName(user.getName());
        profileDTO.setEmail(user.getEmail());

        return ResponseEntity.ok(profileDTO);
    }


}
