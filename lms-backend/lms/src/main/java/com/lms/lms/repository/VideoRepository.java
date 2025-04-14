package com.lms.lms.repository;


import com.lms.lms.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByCourseIdOrderByVideoOrder(Long courseId);

}
