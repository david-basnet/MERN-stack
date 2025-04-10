import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Signup({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password || !userType) {
      setError("Please fill out all fields.");
      return;
    }

    setError(""); 

    try {
      const result = await signup(name, email, password, userType.toLowerCase());
      
      if (result.success) {
        setSuccess(true);
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setUserType("");
        // Show success message for 2 seconds
        setTimeout(() => {
          setSuccess(false);
          // Redirect to login
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <label className="block text-gray-700">Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

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

      <div className="mb-4">
        <p className="text-gray-700">Signup as:</p>
        <div className="flex justify-between">
          <button
            onClick={() => setUserType("teacher")}
            className={`w-1/2 py-2 ${userType === "teacher" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-md hover:bg-blue-500 transition duration-300`}
          >
            Teacher
          </button>
          <button
            onClick={() => setUserType("student")}
            className={`w-1/2 py-2 ${userType === "student" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-md hover:bg-blue-500 transition duration-300`}
          >
            Student
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && (
        <div className="text-green-500 mb-4">
          Signup Successful! Please login with your credentials.
        </div>
      )}

      <button
        onClick={handleSignup}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        Sign Up
      </button>
    </div>
  );
}

export default Signup;
