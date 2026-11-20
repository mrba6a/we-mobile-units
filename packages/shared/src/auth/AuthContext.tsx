import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { WEUser } from '../types';
import { api } from '../api';

interface AuthContextType {
  user: WEUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: WEUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<WEUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WEUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore auth from localStorage
    const storedToken = localStorage.getItem('we_auth_token');
    const storedUser = localStorage.getItem('we_auth_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.setToken(storedToken);
      } catch {
        localStorage.removeItem('we_auth_token');
        localStorage.removeItem('we_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: WEUser, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('we_auth_token', userToken);
    localStorage.setItem('we_auth_user', JSON.stringify(userData));
    api.setToken(userToken);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('we_auth_token');
    localStorage.removeItem('we_auth_user');
    api.setToken(null);
  };

  const updateUser = (userData: Partial<WEUser>) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem('we_auth_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}