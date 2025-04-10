import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Assignments from './pages/Assignments';
import Help from './pages/Help';
import AboutUs from './pages/AboutUs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route component with role check
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/help" element={<Help />} />
            <Route path="/aboutus" element={<AboutUs />} />

            {/* Protected Routes */}
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
