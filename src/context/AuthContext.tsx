import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService, LoginRequest, SignupRequest, UserResponse } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: SignupRequest) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and JWT token
    const storedUser = localStorage.getItem('greenDineUser');
    const token = localStorage.getItem('jwtToken');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        // Validate token (you might want to add token validation here)
        if (apiService.validateToken(token)) {
          setUser(userData);
        } else {
          // Token expired or invalid, clear storage
          localStorage.removeItem('greenDineUser');
          localStorage.removeItem('jwtToken');
        }
      } catch (error) {
        localStorage.removeItem('greenDineUser');
        localStorage.removeItem('jwtToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { token, user: userData } = await apiService.login({ email, password });
      
      // Convert backend user data to frontend User format
      const user: User = {
        id: userData.id.toString(),
        name: userData.fullname,
        email: userData.email,
        role: userData.role as 'customer' | 'admin' || 'customer',
        phone: userData.phoneNumber
      };
      
      setUser(user);
      localStorage.setItem('greenDineUser', JSON.stringify(user));
      localStorage.setItem('jwtToken', token);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: SignupRequest): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await apiService.register(userData);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('greenDineUser');
    localStorage.removeItem('jwtToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};