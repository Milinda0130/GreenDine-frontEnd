# Backend CORS Fix Guide

## 🚨 CORS Issue Detected

Your frontend is getting CORS errors when trying to access your Spring Boot backend. Here's how to fix it:

## 🔧 Solution 1: Update Controller CORS Annotations

Update all your controller classes to include the correct origins:

```java
// Replace this in all your controllers:
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})

// With this (more comprehensive):
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:5175", 
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174", 
    "http://127.0.0.1:5175",
    "http://127.0.0.1:3000"
})
```

## 🔧 Solution 2: Global CORS Configuration (Recommended)

Create a new configuration class in your backend:

```java
package edu.icet.ecom.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")  // Allow all origins for development
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 🔧 Solution 3: Application Properties

Add this to your `application.properties` or `application.yml`:

```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

## 🔧 Solution 4: Security Configuration (if using Spring Security)

If you're using Spring Security, add this to your security configuration:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/**").permitAll()
        );
    return http.build();
}
```

## 🧪 Testing

After implementing the fix:

1. **Restart your Spring Boot backend**
2. **Check the frontend console** - CORS errors should be gone
3. **Test API calls** - Menu items should load properly

## 📝 Current Frontend Ports

Your frontend is running on these ports:
- `http://localhost:5173` (main)
- `http://localhost:5174` (fallback)
- `http://localhost:5175` (fallback)

## 🎯 Quick Fix

The fastest solution is to update your controller annotations:

```java
// In MenuItemController.java, OrderController.java, etc.
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:5175", 
    "http://localhost:3000"
})
```

This will immediately fix the CORS issue!
