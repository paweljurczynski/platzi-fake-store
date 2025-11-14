import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { storage } from '../utils/storage';
import { validateToken } from '../utils/tokenValidation';
import type { LoginRequest } from '../types/auth.types';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = storage.getToken();
    return validateToken(token);
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = storage.getToken();
    const isValid = validateToken(token);
    
    if (!isValid && token) {
      storage.clearTokens();
    }
    
    setIsAuthenticated(isValid);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      
      if (!validateToken(response.access_token)) {
        throw new Error('Invalid token received from server');
      }
      
      storage.setToken(response.access_token);
      if (response.refresh_token) {
        storage.setRefreshToken(response.refresh_token);
      }
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.clearTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
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

