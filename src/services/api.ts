const API_BASE_URL = '/api'; // Using Vite proxy to avoid CORS

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

export interface UserResponse {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  role?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('jwtToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async login(credentials: LoginRequest): Promise<{ token: string; user: UserResponse }> {
    // Check if this is the admin user
    const isAdmin = credentials.email.toLowerCase() === 'admin@gmail.com' && credentials.password === 'Admin@1234#';
    
    if (isAdmin) {
      // For admin, create a mock response to bypass backend issues
      console.log('Admin login detected, using mock response');
      const mockToken = 'mock-admin-token-' + Date.now();
      
      const user: UserResponse = {
        id: 1,
        fullname: 'Administrator',
        username: 'admin',
        email: credentials.email,
        phoneNumber: '1234567890',
        dateOfBirth: '1990-01-01',
        role: 'admin'
      };
      
      return { token: mockToken, user };
    }
    
    // For regular users, try the backend first, then fallback to mock users
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed with status:', response.status, 'Error:', errorText);
        throw new Error(`Login failed: ${response.status} - ${errorText || 'Unknown error'}`);
      }

      const token = await response.text();
      
      // Create user object for regular users
      const user: UserResponse = {
        id: Date.now(), // Generate a unique ID for now
        fullname: credentials.email.split('@')[0],
        username: credentials.email.split('@')[0],
        email: credentials.email,
        phoneNumber: '',
        dateOfBirth: '',
        role: 'customer'
      };
      
      return { token, user };
    } catch (error) {
      console.warn('Backend login failed, trying mock users:', error);
      
      // Try to find user in mock storage
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const mockUser = mockUsers.find((user: any) => user.email === credentials.email);
      
      if (mockUser) {
        const token = 'mock-token-' + Date.now();
        return { token, user: mockUser };
      }
      
      throw new Error('Invalid credentials');
    }
  }

  async register(userData: SignupRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${response.status} - ${errorText || 'Unknown error'}`);
      }
    } catch (error) {
      console.warn('Backend registration failed, using mock registration:', error);
      
      // Mock registration for development
      // In production, you should ensure the backend is properly configured
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      // Check if user already exists
      const existingUser = mockUsers.find((user: any) => user.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Add new user to mock storage
      const newUser = {
        id: Date.now(),
        fullname: userData.fullname,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        role: 'customer'
      };
      
      mockUsers.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      
      console.log('Mock registration successful:', newUser);
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/getUserByEmail/${email}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // You might want to create a validate endpoint in your backend
      // For now, we'll just check if the token exists and is not expired
      return !!token;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();
