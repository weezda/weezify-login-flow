
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

// API base URL
const API_BASE_URL = "https://weez-auth-api-ewhdbra3dbbtfaaw.canadacentral-01.azurewebsites.net";

// Auth storage keys
const STORAGE_KEYS = {
  TOKEN: 'userToken',
  USER: 'userEmail',
  REFRESH_TOKEN: 'auth_refresh_token',
};

interface User {
  username: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, username: string, refreshToken?: string | null) => Promise<boolean>;
  logout: () => Promise<boolean>;
  authFetch: (endpoint: string, options?: any) => Promise<Response>;
  getAuthHeader: () => { Authorization?: string };
  updateUserProfile: (profileData: any) => Promise<boolean>;
  refreshAuthToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to normalize username
const normalizeUsername = (username: any): string => {
  if (!username) return "";
  
  if (typeof username === 'string') {
    try {
      const parsed = JSON.parse(username);
      if (parsed && typeof parsed === 'object' && parsed.username) {
        if (typeof parsed.username === 'string' && parsed.username.includes('{"username":')) {
          try {
            const nestedParsed = JSON.parse(parsed.username);
            return nestedParsed.username || "";
          } catch (e) {
            return parsed.username;
          }
        }
        return parsed.username;
      }
    } catch (e) {
      return username;
    }
    return username;
  } 
  else if (typeof username === 'object' && username !== null) {
    if (username.username && typeof username.username === 'string' && username.username.includes('{"username":')) {
      try {
        const parsed = JSON.parse(username.username);
        return parsed.username || "";
      } catch (e) {
        return username.username || "";
      }
    }
    return username.username || "";
  }
  
  return "";
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing login on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        // Load authentication data from storage
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          let userObj: User;
          
          try {
            // Try to parse the stored user
            const parsedUser = JSON.parse(storedUser);
            
            // Ensure we have a proper user object with a normalized username
            userObj = {
              ...parsedUser,
              username: normalizeUsername(parsedUser)
            };
          } catch (e) {
            // If parsing fails, use a simple object
            userObj = { username: storedUser };
          }
          
          setUser(userObj);
          
          if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken);
          }
          
          console.log('Auth restored from storage, username:', userObj.username);
        }
      } catch (error) {
        console.error('Error loading auth from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredAuth();
  }, []);

  // Login function
  const login = useCallback(async (token: string, username: string, refreshToken: string | null = null): Promise<boolean> => {
    try {
      // Normalize username to ensure it's a clean string
      const normalizedUsername = normalizeUsername(username);
      
      console.log('Normalized username for login:', normalizedUsername);
      
      // Create user object with clean username
      const userObj = { username: normalizedUsername };
      
      // Store token and user data in state
      setToken(token);
      setUser(userObj);
      
      if (refreshToken) {
        setRefreshToken(refreshToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      
      // Save to persistent storage - use a clean object
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
      
      console.log('User logged in:', normalizedUsername);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      // Clear auth state
      setToken(null);
      setUser(null);
      setRefreshToken(null);
      
      // Clear persistent storage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      console.log('User logged out');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }, []);

  // Function to get authorization header
  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Function to make authenticated API requests
  const authFetch = useCallback(async (endpoint: string, options: any = {}): Promise<Response> => {
    const isFullUrl = endpoint.startsWith('http');
    const url = isFullUrl ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Merge headers with auth header
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      // Handle 401 Unauthorized error (token expired)
      if (response.status === 401 && refreshToken) {
        const refreshed = await refreshAuthToken();
        
        if (refreshed) {
          // Retry the original request with new token
          return authFetch(endpoint, options);
        } else {
          // If refresh failed, logout the user
          await logout();
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive"
          });
          throw new Error('Authentication expired. Please log in again.');
        }
      }
      
      return response;
    } catch (error) {
      console.error('Auth fetch error:', error);
      throw error;
    }
  }, [token, refreshToken, getAuthHeader]);

  // Function to refresh the auth token
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    if (!refreshToken) return false;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      
      if (data.token) {
        // Update token in state and storage
        setToken(data.token);
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        
        // Update refresh token if provided
        if (data.refresh_token) {
          setRefreshToken(data.refresh_token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, [refreshToken]);

  // Update user profile
  const updateUserProfile = useCallback(async (profileData: any): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Update local user data
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      
      // Save to storage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  }, [user]);

  // Context value
  const authContextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    authFetch,
    getAuthHeader,
    updateUserProfile,
    refreshAuthToken,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
