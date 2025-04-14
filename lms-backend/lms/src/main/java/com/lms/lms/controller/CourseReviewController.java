package com.lms.lms.controller;



import com.lms.lms.dto.CourseReviewRequest;
import com.lms.lms.model.Course;
import com.lms.lms.model.CourseReview;
import com.lms.lms.model.User;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.CourseReviewRepository;
import com.lms.lms.repository.UserRepository;
import com.lms.lms.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseReviewController {

    @Autowired
    private CourseReviewRepository reviewRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/{courseId}/reviews")
    public String submitReview(@PathVariable Long courseId,
                               @RequestBody CourseReviewRequest request,
                               HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        User student = userRepo.findByEmail(email).orElseThrow();

        Course course = courseRepo.findById(courseId).orElseThrow();

        CourseReview review = new CourseReview();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCourse(course);
        review.setStudent(student);

        reviewRepo.save(review);

        return "Review submitted successfully!";
    }

    @GetMapping("/{courseId}/reviews")
    public List<CourseReview> getCourseReviews(@PathVariable Long courseId) {
        Course course = courseRepo.findById(courseId).orElseThrow();
        return reviewRepo.findByCourse(course);
    }
}

