import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  // Student Registration
  const registerStudent = async (formData) => {
    try {
      const { data } = await api.post('/students/register', formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data.student, role: 'student' }));
      
      setUser({ ...data.student, role: 'student' });
      setIsAuthenticated(true);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Student Login
  const loginStudent = async (credentials) => {
    try {
      const { data } = await api.post('/students/login', credentials);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data.student, role: 'student' }));
      
      setUser({ ...data.student, role: 'student' });
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Admin Login
  const loginAdmin = async (credentials) => {
    try {
      const { data } = await api.post('/admin/login', credentials);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data.admin, role: 'admin' }));
      
      setUser({ ...data.admin, role: 'admin' });
      setIsAuthenticated(true);
      
      toast.success('Admin login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Update Profile
  const updateProfile = async (formData) => {
    try {
      const { data } = await api.put('/students/profile', formData);
      
      const updatedUser = { ...data.student, role: 'student' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    registerStudent,
    loginStudent,
    loginAdmin,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};