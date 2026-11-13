import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('loop_and_love_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Check login on startup
  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem('loop_and_love_token');
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('loop_and_love_user', JSON.stringify(res.user));
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('loop_and_love_token');
          localStorage.removeItem('loop_and_love_user');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('loop_and_love_token', res.token);
        localStorage.setItem('loop_and_love_user', JSON.stringify(res.user));
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.auth.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('loop_and_love_token', res.token);
        localStorage.setItem('loop_and_love_user', JSON.stringify(res.user));
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('loop_and_love_token');
    localStorage.removeItem('loop_and_love_user');
  };

  const refreshProfile = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('loop_and_love_user', JSON.stringify(res.user));
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        isDevelopmentStage: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
