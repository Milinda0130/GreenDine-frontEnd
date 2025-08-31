# CORS Setup Guide for Backend

## 🚨 **CORS Error Fix**

Your frontend is getting blocked by CORS policy. Here's how to fix it:

## 1. **Add CORS Configuration to Your Spring Boot Application**

### **Option A: Using @CrossOrigin Annotation (Quick Fix)**

Add `@CrossOrigin` to your `UserController`:

```java
package edu.icet.ecom.controller;

import edu.icet.ecom.dto.UserDTO;
import edu.icet.ecom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:4200"})
@RequestMapping("/users")
@RestController
@RequiredArgsConstructor
public class UserController {
    // ... your existing code
}
```

### **Option B: Global CORS Configuration (Recommended)**

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
                .allowedOrigins(
                    "http://localhost:5173",  // Vite default
                    "http://localhost:3000",  // React default
                    "http://localhost:4200",  // Angular default
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:4200"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000", 
            "http://localhost:4200",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:4200"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### **Option C: Application Properties (Alternative)**

Add this to your `application.properties` or `application.yml`:

```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:3000,http://localhost:4200
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

## 2. **Update All Your Controllers**

Make sure all your controllers have the `@CrossOrigin` annotation:

```java
// UserController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RestController
@RequestMapping("/users")
public class UserController {
    // ... your code
}

// OrderController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RestController
@RequestMapping("/orders")
public class OrderController {
    // ... your code
}

// ReservationController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RestController
@RequestMapping("/reservations")
public class ReservationController {
    // ... your code
}

// MenuController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RestController
@RequestMapping("/menu")
public class MenuController {
    // ... your code
}

// InventoryController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RestController
@RequestMapping("/inventory")
public class InventoryController {
    // ... your code
}
```

## 3. **Security Configuration (If using Spring Security)**

If you're using Spring Security, add this configuration:

```java
package edu.icet.ecom.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests()
                .requestMatchers("/users/**", "/orders/**", "/reservations/**", "/menu/**", "/inventory/**").permitAll()
                .anyRequest().authenticated();
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 4. **Test Your CORS Setup**

After implementing the CORS configuration:

1. **Restart your backend server**
2. **Test with a simple endpoint**:

```bash
curl -X GET http://localhost:8080/users/getAllUsers \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"
```

3. **Check browser network tab** for CORS headers

## 5. **Common Issues and Solutions**

### **Issue 1: Still getting CORS errors**
- Make sure you restarted your backend server after adding CORS config
- Check that your frontend URL is exactly in the allowed origins list
- Verify the backend is running on the correct port

### **Issue 2: Preflight requests failing**
- Make sure OPTIONS method is allowed
- Check that all required headers are allowed

### **Issue 3: Credentials not working**
- Set `allowCredentials(true)` in your CORS configuration
- Make sure your frontend includes credentials in requests

## 6. **Frontend API Service Update**

Update your `userApi.ts` to include credentials:

```typescript
class UserApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users/getAllUsers`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
      credentials: 'include', // Add this line
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    return response.json();
  }

  // Update all other methods similarly
}
```

## 7. **Quick Test**

After implementing CORS, test this simple endpoint:

```java
@GetMapping("/test")
public ResponseEntity<String> test() {
    return ResponseEntity.ok("CORS is working!");
}
```

Then visit: `http://localhost:8080/test` in your browser.

## 8. **Production Considerations**

For production, replace the localhost origins with your actual domain:

```java
.allowedOrigins("https://yourdomain.com", "https://www.yourdomain.com")
```

## 🎯 **Recommended Solution**

I recommend using **Option B (Global CORS Configuration)** as it's the most comprehensive and maintainable approach.

After implementing this, your User Management page should work perfectly! 🎉


