package com.lms.lms.config;

import com.lms.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.*;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@CrossOrigin
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF since we are using token-based authentication
                .csrf(AbstractHttpConfigurer::disable)

                // Configure CORS using our CorsConfigurationSource bean
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Authorization rules
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        .requestMatchers("/api/register", "/api/login", "/api/home").permitAll()
                        .requestMatchers(
                                "/api/auth/**",              // allow auth-related endpoints
                                "/api/auth/password/**"      // include reset endpoints
                        ).permitAll()
                        .requestMatchers("/api/auth/password/reset",
                                "/api/register",
                                "/api/login",
                                "/api/home",
                                "/api/courses/search",
                                "/api/courses/filter/**").permitAll()
                        .requestMatchers("/api/assignments/**").permitAll()
                        .requestMatchers("/api/student/**").permitAll()
                        .requestMatchers("/api/assignments/download/**").permitAll()
                        .requestMatchers("/assignments/files/**").permitAll()
                        .requestMatchers("/videos/**").permitAll()
                        .requestMatchers("/api/courses", "/api/courses/**").permitAll()
                        .requestMatchers("/api/student/**").hasRole("STUDENT")
                        .requestMatchers("/api/instructor/**").hasRole("INSTRUCTOR")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/notifications/**").permitAll()
                        .requestMatchers("/api/profile/**").authenticated()
                        .anyRequest().authenticated()
                )

                // Stateless session; no session will be used to store user's state.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Basic auth support for now (or remove if using only JWT)
                .httpBasic(AbstractHttpConfigurer::disable)


                // Add JWT authentication filter before the UsernamePasswordAuthenticationFilter in the chain
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        // Build and return the SecurityFilterChain instance.
        return http.build();
    }

    // Define the CorsConfigurationSource bean
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    @Configuration
    public class StaticResourceConfig implements WebMvcConfigurer {

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry.addResourceHandler("/videos/**")
                    .addResourceLocations("file:///C:/Users/admin/Downloads/uploads/videos/");

            registry.addResourceHandler("/assignments/files/**")
                    .addResourceLocations("file:///C:/Users/admin/Downloads/uploads/assignments/");
        }
    }


    // Password encoder bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
