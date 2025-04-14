package com.lms.lms.dto; // or match your package structure

import lombok.Getter;

@Getter
public class NotificationRequest {
    // Getter for userId
    private Long userId;
    // Getter for message
    private String message;

    // Setter for userId
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Setter for message
    public void setMessage(String message) {
        this.message = message;
    }
}
