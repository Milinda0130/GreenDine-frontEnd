# 🚀 Microservices Quick Setup Summary

## ✅ Frontend Configuration (DONE)

Your frontend is now configured to connect to the correct microservice ports:

| Service | Port | Frontend API File |
|---------|------|------------------|
| **User Service** | `8080` | `src/services/api.ts` ✅ |
| **Reservation Service** | `8081` | `src/services/reservationApi.ts` ✅ |
| **Inventory Service** | `8082` | `src/services/inventoryApi.ts` ✅ |

## 🔧 Backend Configuration (YOU NEED TO DO)

### **Step 1: Add CORS to Each Microservice**

Add this CORS configuration to **each of your microservices**:

**File**: `src/main/java/edu/icet/ecom/config/CorsConfig.java`

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
                    "http://localhost:5173",
                    "http://localhost:5174", 
                    "http://localhost:5175",  // Your current port
                    "http://localhost:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### **Step 2: Restart All Microservices**

```bash
# Stop all your microservices
# Start them again in this order:

# 1. User Service (Port 8080)
# 2. Reservation Service (Port 8081)  
# 3. Inventory Service (Port 8082)
```

## 🧪 Test Your Setup

### **Test Each Service:**

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

## 🎯 What This Fixes

- ✅ **CORS Errors**: Each microservice will allow requests from your frontend
- ✅ **Port Configuration**: Frontend connects to correct microservice ports
- ✅ **Authentication**: User registration/login works with User Service
- ✅ **Reservations**: Reservation management works with Reservation Service
- ✅ **Inventory**: Inventory management works with Inventory Service

## 🚨 If You Still Get CORS Errors

1. **Check if all microservices are running** on the correct ports
2. **Verify CORS config is added to each microservice**
3. **Restart all microservices** after adding CORS config
4. **Clear browser cache** and try again

---

**🎉 After following these steps, your microservices should work perfectly with your frontend!**


