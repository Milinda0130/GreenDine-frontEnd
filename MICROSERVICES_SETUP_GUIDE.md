# 🏗️ Microservices Architecture Setup Guide

## 📋 Overview

Since you're using a **microservices architecture**, each service runs on a different port. This guide will help you configure the correct ports and CORS settings for each microservice.

## 🔧 Microservices Port Configuration

### **Current Service Ports:**
Based on your setup, here are the typical microservice ports:

| Service | Port | Purpose |
|---------|------|---------|
| **User Service** | `8080` | Authentication, Registration, User Management |
| **Reservation Service** | `8081` | Table Reservations, Booking Management |
| **Inventory Service** | `8082` | Inventory Management, Stock Control |
| **Order Service** | `8083` | Order Processing (if applicable) |
| **Payment Service** | `8084` | Payment Processing (if applicable) |

## 🔄 Frontend API Configuration

### **Step 1: Update API Service Ports**

Let me update your API services to use the correct ports for each microservice:

**Auth API (User Service)**: `src/services/api.ts`
```typescript
const API_BASE_URL = 'http://localhost:8080'; // User Service
```

**Reservation API**: `src/services/reservationApi.ts`
```typescript
const API_BASE_URL = 'http://localhost:8081'; // Reservation Service
```

**Inventory API**: `src/services/inventoryApi.ts`
```typescript
const API_BASE_URL = 'http://localhost:8082'; // Inventory Service
```

## 🔧 CORS Configuration for Microservices

### **Step 1: Add CORS to Each Microservice**

You need to add CORS configuration to **each microservice** separately. Add this to each service:

**File Path**: `src/main/java/edu/icet/ecom/config/CorsConfig.java` (in each microservice)

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

### **Step 2: Alternative - Add @CrossOrigin to Controllers**

If you prefer, add `@CrossOrigin` to each controller in each microservice:

**UserController.java** (Port 8080):
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/users")
public class UserController {
    // Your existing code...
}
```

**ReservationController.java** (Port 8081):
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/reservation")
public class ReservationController {
    // Your existing code...
}
```

**InventoryController.java** (Port 8082):
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/inventory")
public class InventoryController {
    // Your existing code...
}
```

## 🚀 Service Discovery & API Gateway (Optional)

### **If you have an API Gateway:**
You might want to route all requests through a single API Gateway (e.g., port 8080) and let it route to different microservices internally.

**API Gateway Configuration** (if applicable):
```yaml
# application.yml for API Gateway
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/users/**
        - id: reservation-service
          uri: lb://reservation-service
          predicates:
            - Path=/reservation/**
        - id: inventory-service
          uri: lb://inventory-service
          predicates:
            - Path=/inventory/**
```

## 🧪 Testing Microservices

### **Test Each Service Individually:**

```bash
# Test User Service (Port 8080)
curl -X POST http://localhost:8080/users/register \
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

# Test Reservation Service (Port 8081)
curl -X GET http://localhost:8081/reservation/all

# Test Inventory Service (Port 8082)
curl -X GET http://localhost:8082/inventory/all
```

## 🔍 Debugging Microservices

### **1. Check Service Status**
```bash
# Check if services are running
netstat -an | grep 8080  # User Service
netstat -an | grep 8081  # Reservation Service
netstat -an | grep 8082  # Inventory Service
```

### **2. Check Service Logs**
Look at the console output of each microservice for any errors.

### **3. Test with Postman**
Test each service endpoint individually with Postman to isolate issues.

## 📋 Microservices Checklist

### **✅ User Service (Port 8080)**
- [ ] Service is running on port 8080
- [ ] CORS configuration added
- [ ] `/users/register` endpoint working
- [ ] `/users/login` endpoint working

### **✅ Reservation Service (Port 8081)**
- [ ] Service is running on port 8081
- [ ] CORS configuration added
- [ ] `/reservation/all` endpoint working
- [ ] `/reservation/save` endpoint working

### **✅ Inventory Service (Port 8082)**
- [ ] Service is running on port 8082
- [ ] CORS configuration added
- [ ] `/inventory/all` endpoint working
- [ ] `/inventory/create` endpoint working

## 🚨 Common Microservices Issues

### **Issue 1: Service Not Starting**
**Solution**: Check if the port is already in use by another service.

### **Issue 2: CORS Errors**
**Solution**: Ensure CORS is configured in **each microservice**, not just one.

### **Issue 3: Service Communication**
**Solution**: If services need to communicate, ensure they can reach each other's ports.

### **Issue 4: Database Connections**
**Solution**: Each microservice should have its own database or database schema.

## 🎯 Next Steps

1. **Update the frontend API ports** to match your microservices
2. **Add CORS configuration** to each microservice
3. **Test each service individually**
4. **Test the complete frontend integration**

---

**🎉 Your microservices architecture should now work correctly with proper CORS configuration!**


