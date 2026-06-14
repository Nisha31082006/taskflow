import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token'));
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const persistAuth = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
    localStorage.setItem('taskflow_token', tokenData);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
  };

  // Validate token on mount
  useEffect(() => {
    const verify = async () => {
      const savedToken = localStorage.getItem('taskflow_token');
      if (!savedToken) {
        setInitializing(false);
        return;
      }
      try {
        const data = await authService.getMe();
        setUser(data.user);
      } catch {
        clearAuth();
      } finally {
        setInitializing(false);
      }
    };
    verify();
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const data = await authService.register(formData);
      persistAuth(data.user, data.token);
      toast.success('Account created! Welcome to TaskFlow.');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (formData) => {
    setLoading(true);
    try {
      const data = await authService.login(formData);
      persistAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, initializing, register, login, logout, isAuthenticated: !!token && !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
