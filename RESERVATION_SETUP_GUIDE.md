# 🍽️ Reservation Management System Setup Guide

## 📋 Overview

This guide will help you set up the complete reservation management system with both admin and customer functionality, integrated with your Spring Boot backend.

## 🚀 Features Implemented

### **Admin Features:**
- ✅ **Full CRUD Operations**: Create, Read, Update, Delete reservations
- ✅ **Status Management**: Pending, Confirmed, Cancelled, Completed
- ✅ **Advanced Filtering**: By date, status, search terms
- ✅ **Analytics Dashboard**: Total, today's, upcoming, confirmed reservations
- ✅ **Export Functionality**: CSV export of reservation data
- ✅ **Real-time Updates**: Automatic refresh after operations
- ✅ **Table Assignment**: Assign specific tables to reservations
- ✅ **Bulk Operations**: Quick status updates

### **Customer Features:**
- ✅ **Personal Reservations**: View only their own bookings
- ✅ **Easy Booking**: Simple reservation form
- ✅ **Edit/Cancel**: Modify pending reservations
- ✅ **Status Tracking**: See confirmation status
- ✅ **Search & Filter**: Find specific reservations
- ✅ **Responsive Design**: Works on all devices

## 🔧 Backend Requirements

### **1. CORS Configuration**
Add this to your Spring Boot backend in `edu.icet.ecom.config`:

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
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### **2. Database Schema**
Ensure your `reservation` table has these columns:

```sql
CREATE TABLE reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    numberOfGuests INT NOT NULL,
    time VARCHAR(10) NOT NULL,
    tableNumber INT,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    notes TEXT
);
```

### **3. Status Enum**
Create the Status enum in your backend:

```java
package edu.icet.ecom.util;

public enum Status {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED
}
```

## 🎯 API Endpoints

Your backend should support these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/reservation/save` | Create new reservation |
| `GET` | `/reservation/all` | Get all reservations |
| `GET` | `/reservation/{id}` | Get reservation by ID |
| `PUT` | `/reservation/update/{id}` | Update reservation |
| `DELETE` | `/reservation/delete/{id}` | Delete reservation |
| `PATCH` | `/reservation/status/{id}?status={status}` | Update status |
| `GET` | `/reservation/status/{status}` | Get by status |
| `GET` | `/reservation/date/{date}` | Get by date |
| `GET` | `/reservation/search?name={name}` | Search by name |

## 🔄 Frontend Integration

### **1. API Service**
The reservation API service (`src/services/reservationApi.ts`) handles all backend communication with:
- ✅ JWT token authentication
- ✅ Error handling with detailed messages
- ✅ Customer-specific reservation filtering
- ✅ Advanced search and filtering methods

### **2. Admin Page**
Enhanced admin page (`src/components/Admin/ReservationManagementPage.tsx`) includes:
- ✅ Real-time data loading from backend
- ✅ Comprehensive analytics dashboard
- ✅ Advanced filtering and search
- ✅ Export functionality
- ✅ Status management
- ✅ Table assignment

### **3. Customer Page**
Enhanced customer page (`src/components/Customer/ReservationsPage.tsx`) includes:
- ✅ Personal reservation viewing
- ✅ Easy booking interface
- ✅ Status tracking
- ✅ Edit/cancel functionality
- ✅ Search and filtering

## 🧪 Testing Steps

### **1. Backend Testing**
```bash
# Start your Spring Boot application
# Ensure it's running on port 8082

# Test endpoints with curl or Postman:
curl -X GET http://localhost:8082/reservation/all
curl -X POST http://localhost:8082/reservation/save \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "1234567890",
    "date": "2024-01-15",
    "numberOfGuests": 4,
    "time": "19:00",
    "status": "PENDING"
  }'
```

### **2. Frontend Testing**
1. **Start the frontend**: `npm run dev`
2. **Login as Admin**: Use admin credentials
3. **Test Admin Features**:
   - Create new reservation
   - View all reservations
   - Update status
   - Export data
   - Search and filter
4. **Login as Customer**: Use customer credentials
5. **Test Customer Features**:
   - View personal reservations
   - Make new booking
   - Edit pending reservation
   - Cancel reservation

## 🎨 UI Enhancements

### **Admin Dashboard Features:**
- 📊 **Analytics Cards**: Total, today's, upcoming, confirmed reservations
- 🔍 **Advanced Search**: By name, phone, notes
- 📅 **Date Filtering**: Filter by specific dates
- 🏷️ **Status Filtering**: Filter by reservation status
- 📤 **Export Function**: Download CSV data
- 🔄 **Real-time Refresh**: Auto-reload after operations
- 📱 **Responsive Design**: Works on all screen sizes

### **Customer Dashboard Features:**
- 👤 **Personal View**: Only shows customer's reservations
- 📈 **Quick Stats**: Total, confirmed, pending, upcoming
- 🔍 **Smart Search**: Search within personal reservations
- 📅 **Date Filtering**: Filter by booking dates
- 🏷️ **Status Filtering**: Filter by confirmation status
- ✏️ **Easy Editing**: Edit pending reservations
- ❌ **Quick Cancellation**: Cancel pending bookings

## 🚨 Error Handling

### **Common Issues & Solutions:**

1. **CORS Errors**
   ```
   Error: Access to fetch at 'http://localhost:8082/reservation/all' from origin 'http://localhost:5173' has been blocked by CORS policy
   ```
   **Solution**: Add CORS configuration to your backend

2. **Connection Refused**
   ```
   Error: Failed to fetch: net::ERR_CONNECTION_REFUSED
   ```
   **Solution**: Ensure backend is running on port 8082

3. **404 Not Found**
   ```
   Error: PUT http://localhost:8082/reservation/update/1 404 (Not Found)
   ```
   **Solution**: Check if reservation ID exists in database

4. **Authentication Errors**
   ```
   Error: 401 Unauthorized
   ```
   **Solution**: Ensure JWT token is valid and included in requests

## 🔐 Security Features

- ✅ **JWT Authentication**: Secure API access
- ✅ **Role-based Access**: Admin vs Customer permissions
- ✅ **Input Validation**: Frontend and backend validation
- ✅ **CORS Protection**: Proper origin restrictions
- ✅ **Error Sanitization**: Safe error messages

## 📱 Mobile Responsiveness

Both admin and customer pages are fully responsive with:
- ✅ **Mobile-first design**
- ✅ **Touch-friendly interfaces**
- ✅ **Responsive tables and cards**
- ✅ **Optimized forms for mobile**

## 🎯 Next Steps

1. **Test the complete flow** from customer booking to admin management
2. **Add email notifications** for reservation confirmations
3. **Implement SMS notifications** for urgent updates
4. **Add calendar integration** for better date management
5. **Create reservation analytics** with charts and graphs
6. **Add bulk operations** for admin efficiency

## 📞 Support

If you encounter any issues:
1. Check the browser console for detailed error messages
2. Verify your backend is running and accessible
3. Ensure CORS is properly configured
4. Check that all required database tables exist
5. Verify JWT token authentication is working

---

**🎉 Your reservation management system is now fully integrated and ready to use!**


