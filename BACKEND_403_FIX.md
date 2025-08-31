# Backend 403 Forbidden Fix Guide

## 🚨 403 Forbidden Issue Detected

Your frontend is now successfully connecting to your backend (no CORS errors), but getting 403 Forbidden responses. This means your backend is rejecting the requests due to authentication/authorization issues.

## 🔍 Common Causes of 403 Forbidden:

1. **Spring Security Configuration** - Endpoints require authentication
2. **Missing Authentication Headers** - JWT token or session required
3. **Role-based Access Control** - User doesn't have required permissions
4. **CSRF Protection** - Cross-site request forgery protection enabled
5. **Method-level Security** - @PreAuthorize annotations blocking access

## 🔧 Solution 1: Disable Security for Development (Quick Fix)

Add this to your main application class or create a security configuration:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/menu-items/**").permitAll()  // Allow public access to menu
                .requestMatchers("/orders/**").permitAll()      // Allow public access to orders
                .requestMatchers("/users/**").permitAll()       // Allow public access to users
                .requestMatchers("/**").permitAll()             // Allow all requests for development
            );
        return http.build();
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

## 🔧 Solution 2: Make Menu Endpoints Public

Update your MenuItemController to allow public access:

```java
@RestController
@RequestMapping("/menu-items")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
public class MenuItemController {

    private final MenuItemService menuItemService;

    // Make these endpoints public (no authentication required)
    @GetMapping
    @PreAuthorize("permitAll()")  // Allow all users
    public ResponseEntity<List<MenuItemDTO>> getAllMenuItems() {
        try {
            List<MenuItemDTO> menuItems = menuItemService.getAllMenuItems();
            return new ResponseEntity<>(menuItems, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/available")
    @PreAuthorize("permitAll()")  // Allow all users
    public ResponseEntity<List<MenuItemDTO>> getAvailableMenuItems() {
        try {
            List<MenuItemDTO> menuItems = menuItemService.getAvailableMenuItems();
            return new ResponseEntity<>(menuItems, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Other endpoints...
}
```

## 🔧 Solution 3: Application Properties Configuration

Add this to your `application.properties`:

```properties
# Disable security for development
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration

# Or configure security to allow all requests
spring.security.user.name=admin
spring.security.user.password=admin
spring.security.user.roles=ADMIN

# Disable CSRF
spring.security.csrf.enabled=false
```

## 🔧 Solution 4: Check Your Current Security Configuration

Look for these in your backend:

1. **@EnableWebSecurity** annotations
2. **@PreAuthorize** annotations on controller methods
3. **SecurityFilterChain** beans
4. **WebSecurityConfigurerAdapter** classes

## 🧪 Testing Steps:

1. **Check Backend Logs** - Look for security-related errors
2. **Test with Postman** - Try accessing `/menu-items` directly
3. **Check Authentication** - Verify if endpoints require login
4. **Review Security Config** - Look for restrictive security settings

## 🎯 Quick Diagnostic:

Add this to your controller to test:

```java
@GetMapping("/test")
public ResponseEntity<String> test() {
    return ResponseEntity.ok("Backend is working!");
}
```

Then test: `http://localhost:8080/menu-items/test`

## 📝 Frontend Fallback:

The frontend now:
- ✅ Handles 403 errors gracefully
- ✅ Tries without auth headers
- ✅ Falls back to mock data
- ✅ Shows helpful error messages

## 🚀 Recommended Action:

1. **Add SecurityConfig class** (Solution 1) - Most comprehensive
2. **Restart your backend**
3. **Test menu endpoints** - Should work without authentication
4. **Gradually add security** - Once basic functionality works

Your frontend is ready - just fix the backend security configuration! 🎯
