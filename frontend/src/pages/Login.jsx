import React, { useState } from "react";
import Signup from "./Signup";  
import { useAuth } from "../context/AuthContext"; 
import { useNavigate, Link } from "react-router-dom";

const API_URL = 'http://localhost:5000/api';

function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  
  const { login } = useAuth(); 

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError(""); 

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-2xl font-semibold text-gray-700">Login Successful! Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {!isSignup ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <button
              onClick={handleLogin}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>

            <p className="mt-4 text-center text-sm text-black">
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignup(true)}
                className="text-blue-600 cursor-pointer"
              >
                Sign up here
              </span>
            </p>
          </>
        ) : (
          <Signup onClose={handleClose} />
        )}
      </div>
    </div>
  );
}

export default Login;
