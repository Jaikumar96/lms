package com.lms.lms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.CorsFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;

@Component
public class LoggingCorsFilter extends CorsFilter {
    private static final Logger log = LoggerFactory.getLogger(LoggingCorsFilter.class);


    public LoggingCorsFilter(UrlBasedCorsConfigurationSource source) {
        super(source);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        log.info("CORS Filter applied: " + request.getRequestURL());
        super.doFilterInternal(request, response, filterChain);
    }


}
