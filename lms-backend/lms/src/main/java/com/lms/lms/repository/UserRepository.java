package com.lms.lms.repository;



import com.lms.lms.model.Role;
import com.lms.lms.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole(Role role);
    Optional<User> findByResetToken(String token);
    Page<User> findByRole(Role role, Pageable pageable);


}

