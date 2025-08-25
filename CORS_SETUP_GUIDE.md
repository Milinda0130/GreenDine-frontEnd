# 🔧 CORS Configuration Setup Guide

## 🚨 Current Issue
You're getting CORS errors because your Spring Boot backend doesn't have proper CORS configuration. This guide will help you fix this.

## 📋 Error Details
```
Access to fetch at 'http://localhost:8081/users/register' from origin 'http://localhost:5175' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🔧 Solution: Add CORS Configuration to Your Backend

### **Step 1: Create CORS Configuration Class**

Add this file to your Spring Boot backend project:

**File Path**: `src/main/java/edu/icet/ecom/config/CorsConfig.java`

```java
package edu.icet.ecom.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173",  // Vite default port
                    "http://localhost:5174",  // Vite alternative port
                    "http://localhost:5175",  // Your current port
                    "http://localhost:3000"   // React default port
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // 1 hour
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow multiple origins
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedOrigin("http://localhost:5174");
        configuration.addAllowedOrigin("http://localhost:5175");
        configuration.addAllowedOrigin("http://localhost:3000");
        
        // Allow all methods
        configuration.addAllowedMethod("*");
        
        // Allow all headers
        configuration.addAllowedHeader("*");
        
        // Allow credentials
        configuration.setAllowCredentials(true);
        
        // Set max age
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### **Step 2: Alternative Method - Add @CrossOrigin to Controllers**

If the above doesn't work, you can also add `@CrossOrigin` annotations to your controllers:

**UserController.java**:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/users")
public class UserController {
    // Your existing code...
}
```

**ReservationController.java**:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/reservation")
public class ReservationController {
    // Your existing code...
}
```

**InventoryController.java**:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/inventory")
public class InventoryController {
    // Your existing code...
}
```

### **Step 3: Update application.properties**

Add these properties to your `application.properties` file:

```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600
```

## 🔄 Frontend Configuration

### **Current API Ports:**
- **Auth API**: `http://localhost:8081` ✅ (Updated)
- **Reservation API**: `http://localhost:8081` ✅ (Already correct)
- **Inventory API**: `http://localhost:8081` ✅ (Updated)

### **Frontend Port:**
- **Current**: `http://localhost:5175` ✅ (Included in CORS config)

## 🧪 Testing Steps

### **1. Restart Your Backend**
```bash
# Stop your Spring Boot application
# Start it again
./mvnw spring-boot:run
# or
java -jar your-app.jar
```

### **2. Test CORS Configuration**
Open your browser's Developer Tools (F12) and check the Console for any CORS errors.

### **3. Test API Endpoints**
Try these curl commands to test your endpoints:

```bash
# Test user registration
curl -X POST http://localhost:8081/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "phoneNumber": "1234567890",
    "dateOfBirth": "1990-01-01",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Test user login
curl -X POST http://localhost:8081/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test reservation endpoint
curl -X GET http://localhost:8081/reservation/all

# Test inventory endpoint
curl -X GET http://localhost:8081/inventory/all
```

## 🚨 Common Issues & Solutions

### **Issue 1: Still Getting CORS Errors**
**Solution**: Make sure you've restarted your Spring Boot application after adding the CORS configuration.

### **Issue 2: Different Port Numbers**
**Solution**: Update the CORS configuration to include your specific frontend port.

### **Issue 3: Preflight Requests Failing**
**Solution**: Ensure your backend supports OPTIONS requests and returns proper CORS headers.

### **Issue 4: Credentials Not Working**
**Solution**: Make sure `allowCredentials(true)` is set in your CORS configuration.

## 🔍 Debugging Steps

### **1. Check Backend Logs**
Look for any errors in your Spring Boot console when making requests.

### **2. Check Browser Network Tab**
- Open Developer Tools → Network tab
- Make a request from your frontend
- Check if the OPTIONS preflight request succeeds
- Look for CORS headers in the response

### **3. Test with Postman**
Try making the same requests with Postman to see if the backend works without CORS.

## 📞 Support

If you're still having issues:

1. **Verify your backend is running** on port 8081
2. **Check that the CORS configuration file** is in the correct package
3. **Restart your Spring Boot application** after making changes
4. **Clear your browser cache** and try again
5. **Check the browser console** for detailed error messages

---

**🎉 After following these steps, your CORS issues should be resolved!**


