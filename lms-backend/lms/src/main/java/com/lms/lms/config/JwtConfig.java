package com.lms.lms.config;



import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Bean
    public SecretKey jwtSecretKey() {
        // ✅ This generates a secure key for HS512 (512 bits = 64 bytes)
        return Keys.secretKeyFor(SignatureAlgorithm.HS512);
    }
}



