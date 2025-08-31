# 🍽️ Order & Menu Management Setup Guide

## 📋 Overview

I've successfully integrated your order and menu management microservices with the frontend! Here's what's been added:

### **✅ New Features Added:**

1. **Menu Management (Admin)** - Complete CRUD operations for menu items
2. **Order Management (Admin)** - Track and manage all restaurant orders
3. **Customer Orders (Customer)** - Customers can view their order history
4. **Advanced Features** - Search, filter, analytics, export functionality

## 🔧 Microservices Configuration

### **Updated Port Configuration:**

| Service | Port | Purpose | Frontend API File |
|---------|------|---------|------------------|
| **User Service** | `8080` | Authentication & Registration | `src/services/api.ts` ✅ |
| **Reservation Service** | `8081` | Table Reservations | `src/services/reservationApi.ts` ✅ |
| **Inventory Service** | `8082` | Inventory Management | `src/services/inventoryApi.ts` ✅ |
| **Order & Menu Service** | `8083` | Orders & Menu Items | `src/services/orderApi.ts` ✅ |
| **Order & Menu Service** | `8083` | Menu Management | `src/services/menuApi.ts` ✅ |

## 🎯 New Admin Features

### **1. Menu Management (`/admin/menu`)**
- **Create/Edit/Delete** menu items
- **Category management** (Appetizers, Main Course, Desserts, etc.)
- **Dietary options** (Vegetarian, Vegan, Gluten-Free, etc.)
- **Ingredient tracking** with common ingredients list
- **Image management** with URL support
- **Availability toggle** (Available/Unavailable)
- **Search & Filter** by category, availability, name
- **Export to CSV** functionality
- **Real-time analytics** (Total items, available items, categories, avg price)

### **2. Order Management (`/admin/orders`)**
- **View all orders** with detailed information
- **Status management** (PENDING → PREPARING → READY → DELIVERED)
- **Order types** (DINE_IN, TAKEAWAY, DELIVERY)
- **Customer information** display
- **Order items** with images and quantities
- **Table management** for dine-in orders
- **Search & Filter** by customer, status, type, table
- **Export to CSV** functionality
- **Real-time analytics** (Revenue, pending orders, today's orders, avg order value)
- **Order details modal** with complete information

## 👤 New Customer Features

### **3. Customer Orders (`/orders`)**
- **View personal order history**
- **Track current orders** with real-time status
- **Order details** with items, prices, and timestamps
- **Search & Filter** by order ID, status
- **Order statistics** (Total spent, active orders, completed orders, avg order value)
- **Refresh functionality** to get latest updates

## 🔧 Backend Configuration Required

### **Step 1: Add CORS to Order/Menu Microservice (Port 8083)**

Add this CORS configuration to your **Order & Menu microservice**:

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

### **Step 2: Alternative - Add @CrossOrigin to Controllers**

If you prefer, add `@CrossOrigin` to your controllers:

**MenuItemController.java**:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/menu-items")
public class MenuItemController {
    // Your existing code...
}
```

**OrderController.java**:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    // Your existing code...
}
```

**OrderItemController.java**:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
@RestController
@RequestMapping("/order-items")
public class OrderItemController {
    // Your existing code...
}
```

## 🧪 Testing Your Setup

### **Test Menu Management:**

```bash
# Test Menu Service (Port 8083)
curl -X GET http://localhost:8083/menu-items

# Test creating a menu item
curl -X POST http://localhost:8083/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Classic tomato and mozzarella pizza",
    "price": 12.99,
    "category": "Main Course",
    "image": "https://example.com/pizza.jpg",
    "available": true,
    "dietary": ["Vegetarian"],
    "ingredients": ["Tomato", "Mozzarella", "Basil"]
  }'
```

### **Test Order Management:**

```bash
# Test Order Service (Port 8083)
curl -X GET http://localhost:8083/api/orders

# Test creating an order
curl -X POST http://localhost:8083/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "customerName": "John Doe",
    "total": 25.98,
    "status": "PENDING",
    "type": "DINE_IN",
    "tableNumber": 5,
    "orderItems": [
      {
        "menuItemId": 1,
        "name": "Margherita Pizza",
        "price": 12.99,
        "quantity": 2
      }
    ]
  }'
```

## 🎯 Frontend Routes

### **Admin Routes:**
- `/admin/menu` - Menu Management
- `/admin/orders` - Order Management
- `/admin/inventory` - Inventory Management
- `/admin/reservations` - Reservation Management
- `/admin/analytics` - Analytics Dashboard

### **Customer Routes:**
- `/menu` - Browse Menu
- `/cart` - Shopping Cart
- `/orders` - Order History
- `/reservations` - Table Reservations
- `/rewards` - Rewards Program

## 🚀 Additional Features Ideas

### **For Future Enhancement:**

1. **Real-time Order Updates** - WebSocket integration for live order status
2. **Push Notifications** - Notify customers when orders are ready
3. **Order Tracking** - GPS tracking for delivery orders
4. **Payment Integration** - Online payment processing
5. **Loyalty Program** - Points system for repeat customers
6. **Menu Analytics** - Popular items, peak hours, revenue trends
7. **Kitchen Display** - Digital order display for kitchen staff
8. **Inventory Alerts** - Low stock notifications
9. **Customer Reviews** - Rating and feedback system
10. **Mobile App** - Native mobile application

## 🔍 Troubleshooting

### **Common Issues:**

1. **CORS Errors** - Ensure CORS is configured in all microservices
2. **Port Conflicts** - Verify each microservice runs on the correct port
3. **Database Issues** - Check database connections and data integrity
4. **Authentication** - Ensure JWT tokens are properly handled

### **Debug Steps:**

1. **Check Service Status:**
   ```bash
   netstat -an | grep 8080  # User Service
   netstat -an | grep 8081  # Reservation Service
   netstat -an | grep 8082  # Inventory Service
   netstat -an | grep 8083  # Order/Menu Service
   ```

2. **Test API Endpoints** with Postman or curl
3. **Check Browser Console** for JavaScript errors
4. **Verify Database** data exists and is accessible

## 🎉 Success Checklist

- [ ] All microservices are running on correct ports
- [ ] CORS configuration added to all microservices
- [ ] Menu management working (create, edit, delete items)
- [ ] Order management working (view, update status, delete orders)
- [ ] Customer can view their order history
- [ ] Search and filter functionality working
- [ ] Export to CSV working
- [ ] Analytics displaying correctly
- [ ] No CORS errors in browser console

---

**🎉 Your restaurant management system now has comprehensive order and menu management capabilities!**

