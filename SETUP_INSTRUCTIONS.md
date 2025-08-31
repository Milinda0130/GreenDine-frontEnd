# Frontend-Backend Integration Setup

## Overview
This document provides instructions for integrating your React frontend with your Spring Boot backend for the restaurant management system.

## Backend Setup

### 1. Add CORS Configuration
Add the `CORS_Configuration.java` file to your Spring Boot project in the `edu.icet.ecom.config` package.

### 2. Update UserDTO
Make sure your `UserDTO` class matches the frontend expectations:

```java
public class UserDTO {
    private Long id;
    private String fullname;
    private String username;
    private String email;
    private String phoneNumber;
    private Date dateOfBirth;
    private String password;
    private String confirmPassword;
    private String role; // Add this field if not present
    
    // Getters and setters
}
```

### 3. Update UserEntity
Ensure your `UserEntity` has a `role` field:

```java
@Entity
public class UserEntity {
    // ... existing fields
    private String role = "customer"; // Default role
    
    // Add getter and setter for role
}
```

### 4. Update UserServiceImpl
In your `createUser` method, set a default role:

```java
@Override
@Transactional
public void createUser(UserDTO userDTO) {
    String validationResult = validateUser(userDTO);
    if (validationResult != null) {
        throw new IllegalArgumentException(validationResult);
    }
    
    // Set default role if not provided
    if (userDTO.getRole() == null) {
        userDTO.setRole("customer");
    }
    
    userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));

    try {
        UserEntity user = modelMapper.map(userDTO, UserEntity.class);
        userRepository.save(user);
        log.info("User created successfully with ID: {}", user.getId());
    } catch (DataIntegrityViolationException e) {
        log.error("Error creating user: {}", e.getMessage());
        throw new DataIntegrityViolationException("Error creating user", e);
    }
}
```

### 5. Create Admin User (Optional)
If you want to create an admin user in your database, you can add this to your database initialization or create it manually:

```sql
INSERT INTO users (fullname, username, email, phone_number, date_of_birth, password, role) 
VALUES ('Administrator', 'admin', 'admin@gmail.com', '1234567890', '1990-01-01', '$2a$10$encoded_password_hash', 'admin');
```

**Note:** The frontend will automatically detect admin users based on the email `admin@gmail.com` and assign the admin role.

## Frontend Setup

### 1. Update API Base URL
In `src/services/api.ts`, update the `API_BASE_URL` to match your Spring Boot server:

```typescript
const API_BASE_URL = 'http://localhost:8080'; // Update this to your Spring Boot server URL
```

### 2. Install Dependencies
Make sure all required dependencies are installed:

```bash
npm install
```

### 3. Start the Frontend
```bash
npm run dev
```

## Testing the Integration

### 1. Start Your Spring Boot Backend
Make sure your Spring Boot application is running on the configured port (default: 8080).

### 2. Test Registration
1. Navigate to the signup page
2. Fill in all required fields:
   - Full Name (at least 3 characters)
   - Username (at least 3 characters)
   - Email (valid format)
   - Phone Number (exactly 10 digits)
   - Date of Birth
   - Password (at least 8 characters with uppercase, lowercase, and digit)
   - Confirm Password
3. Submit the form
4. You should see a success message and be redirected to login

### 3. Test Login
1. Navigate to the login page
2. Use the email and password from the registration
3. Submit the form
4. You should be logged in and redirected to the home page

### 4. Test Admin Access
1. Navigate to the login page
2. Use admin credentials: `admin@gmail.com` / `Admin@1234`
3. Submit the form
4. You should be logged in as admin and see admin navigation options
5. Admin users will see different menu items and have access to admin features

## API Endpoints Used

The frontend communicates with these backend endpoints:

- `POST /users/register` - User registration
- `POST /users/login` - User login (returns JWT token)
- `GET /users/getUserByEmail/{email}` - Get user details by email

## Error Handling

The frontend handles these common errors:
- Invalid email format
- Password validation failures
- Duplicate email registration
- Invalid login credentials
- Network/API errors

## Security Notes

1. **JWT Token Storage**: Tokens are stored in localStorage. For production, consider using httpOnly cookies.
2. **Password Validation**: The backend validates passwords according to your requirements.
3. **CORS**: Configure CORS properly to allow frontend-backend communication.
4. **HTTPS**: Use HTTPS in production for secure communication.

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure the CORS configuration is added to your Spring Boot application.
2. **Port Mismatch**: Ensure the API_BASE_URL matches your Spring Boot server port.
3. **Database Connection**: Verify your database is running and accessible.
4. **JWT Token Issues**: Check that your JWT service is properly configured.

### Debug Steps:

1. Check browser console for JavaScript errors
2. Check Spring Boot logs for backend errors
3. Verify API endpoints are accessible via Postman or similar tool
4. Ensure all required fields are being sent in the correct format

## Next Steps

After successful integration, you can:
1. Add more user roles (admin, staff, etc.)
2. Implement password reset functionality
3. Add email verification
4. Implement session management
5. Add more security features


