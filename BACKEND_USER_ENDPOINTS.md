# Backend User Management Endpoints

To complete the user management functionality, please add these endpoints to your `UserController`:

## 1. Delete User Endpoint

Add this method to your `UserController`:

```java
@DeleteMapping("/deleteUser/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    try {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        return ResponseEntity.notFound().build();
    }
}
```

And add this method to your `UserService`:

```java
public void deleteUser(Long id) {
    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
    userRepository.delete(user);
}
```

## 2. Update User Endpoint (Fix)

Your current update endpoint uses `@PostMapping` but should use `@PutMapping` for RESTful conventions:

```java
@PutMapping("/updateUser/{id}")
public ResponseEntity<Void> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
    try {
        userService.updateUser(id, userDTO);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}
```

## 3. Enhanced User Service Methods

Add these methods to your `UserService`:

```java
public void updateUser(Long id, UserDTO userDTO) {
    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    user.setFullname(userDTO.getFullname());
    user.setUsername(userDTO.getUsername());
    user.setEmail(userDTO.getEmail());
    user.setPhoneNumber(userDTO.getPhoneNumber());
    user.setDateOfBirth(userDTO.getDateOfBirth());
    
    // Only update password if provided
    if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
        user.setPassword(userDTO.getPassword()); // Consider hashing the password
    }
    
    userRepository.save(user);
}

public void deleteUser(Long id) {
    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
    userRepository.delete(user);
}
```

## 4. Enhanced UserDTO

Make sure your `UserDTO` has all the necessary fields:

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String fullname;
    private String username;
    private String email;
    private String phoneNumber;
    private Date dateOfBirth;
    private String password;
    private String confirmPassword;
}
```

## 5. Complete UserController

Here's how your complete `UserController` should look:

```java
package edu.icet.ecom.controller;

import edu.icet.ecom.dto.UserDTO;
import edu.icet.ecom.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/users")
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Void> createUser(@RequestBody UserDTO userDTO) {
        userService.createUser(userDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/updateUser/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            userService.updateUser(id, userDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getUserByEmail/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        UserDTO user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/authenticate")
    public ResponseEntity<Void> authenticateUser(
            @RequestParam String email,
            @RequestParam String password
    ) {
        userService.authenticateUser(email, password);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/forgotPassword")
    public ResponseEntity<Void> forgotPassword(
            @RequestParam String password, 
            @RequestParam String confirmPassword,
            @RequestParam String newPassword
    ) {
        userService.forgotPassword(password, confirmPassword, newPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public String login(@RequestBody UserDTO users) {
        return userService.verify(users);
    }
}
```

## 6. Security Considerations

1. **Password Hashing**: Always hash passwords before storing them in the database
2. **Input Validation**: Add validation annotations to your DTOs
3. **Authentication**: Ensure only admins can access user management endpoints
4. **CORS**: Make sure your CORS configuration allows the frontend to access these endpoints

## 7. Testing

After implementing these endpoints, test them using:

- **Get All Users**: `GET http://localhost:8080/users/getAllUsers`
- **Create User**: `POST http://localhost:8080/users/register`
- **Update User**: `PUT http://localhost:8080/users/updateUser/{id}`
- **Delete User**: `DELETE http://localhost:8080/users/deleteUser/{id}`
- **Reset Password**: `PUT http://localhost:8080/users/forgotPassword`

The frontend User Management page will now work perfectly with these backend endpoints! 🎉






