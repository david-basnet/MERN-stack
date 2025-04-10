import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the application and provide the context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on component mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      // Set up axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user: userData } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsLoggedIn(true);
      
      // Set up axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        role
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear state
    setUser(null);
    setIsLoggedIn(false);

    // Redirect to home page
    window.location.href = '/';
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;  // Default export
