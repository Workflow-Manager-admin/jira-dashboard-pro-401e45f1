import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('sessionToken');
      if (token) {
        const session = await auth.getSession();
        if (session.authenticated) {
          setUser({
            email: session.user_email,
            domain: session.domain,
          });
        } else {
          localStorage.removeItem('sessionToken');
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.removeItem('sessionToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await auth.login(credentials);
      if (response.success) {
        localStorage.setItem('sessionToken', response.session_token);
        setUser({
          email: credentials.email,
          domain: credentials.domain,
        });
        navigate('/dashboard');
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sessionToken');
      setUser(null);
      navigate('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
