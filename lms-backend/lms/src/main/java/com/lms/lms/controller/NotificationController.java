package com.lms.lms.controller;

import com.lms.lms.model.Notification;
import com.lms.lms.model.User;
import com.lms.lms.repository.NotificationRepository;
import com.lms.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.lms.lms.dto.NotificationRequest;


import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(notificationRepo.findByUserId(user.getId()));
    }

    @PostMapping(value = "/send", consumes = "application/json")
    public ResponseEntity<?> sendNotification(@RequestBody NotificationRequest request) {
        System.out.println(">>> Inside sendNotification() for userId: " + request.getUserId());

        return userRepo.findById(request.getUserId())
                .map(user -> {
                    Notification notification = new Notification();
                    notification.setUser(user);
                    notification.setMessage(request.getMessage());
                    notificationRepo.save(notification);
                    return ResponseEntity.ok("Notification sent!");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }






}
