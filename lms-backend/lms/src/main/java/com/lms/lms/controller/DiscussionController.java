package com.lms.lms.controller;


import com.lms.lms.dto.DiscussionRequest;
import com.lms.lms.model.*;
import com.lms.lms.repository.*;
import com.lms.lms.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class DiscussionController {

    @Autowired
    private DiscussionRepository discussionRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    // POST Question
    @PostMapping("/{courseId}/discussions")
    public String postDiscussion(@PathVariable Long courseId, @RequestBody DiscussionRequest request, HttpServletRequest httpReq) {
        String token = httpReq.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User user = userRepo.findByEmail(email).orElseThrow();

        Course course = courseRepo.findById(courseId).orElseThrow();

        Discussion discussion = new Discussion();
        discussion.setMessage(request.getMessage());
        discussion.setTimestamp(LocalDateTime.now());
        discussion.setAuthor(user);
        discussion.setCourse(course);

        discussionRepo.save(discussion);
        return "Discussion posted!";
    }

    // GET All Discussions in Course
    @GetMapping("/{courseId}/discussions")
    public List<Discussion> getCourseDiscussions(@PathVariable Long courseId) {
        Course course = courseRepo.findById(courseId).orElseThrow();
        return discussionRepo.findByCourse(course);
    }
}
