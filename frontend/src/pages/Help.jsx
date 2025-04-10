import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Help() {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleIssueChange = (event) => {
    setSelectedIssue(event.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedIssue) {
      setError("Please select an issue");
      return;
    }

    if (!formData.name || !formData.email || !formData.description) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/help/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user && { "Authorization": `Bearer ${localStorage.getItem("token")}` })
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          issue: selectedIssue,
          description: formData.description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit help request");
      }

      setSuccess("Help request submitted successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", description: "" });
      setSelectedIssue("");
      
      // Log the submission for debugging
      console.log('Help submission successful:', data);
    } catch (error) {
      console.error('Error submitting help request:', error);
      setError(error.message || "Failed to submit help request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Need Help?</h1>
          
          <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-semibold text-blue-800 mb-2">Select Issue</label>
          <select
            value={selectedIssue}
            onChange={handleIssueChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
          >
            <option value="" disabled>Select an issue...</option>
            <option value="login">Login Issues</option>
            <option value="assignment">Assignment Submission Problems</option>
            <option value="account">Account Management</option>
            <option value="other">Other Issues</option>
          </select>
        </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-blue-800 mb-2">Name</label>
            <input
              type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
                placeholder="Enter your name"
            />
          </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-blue-800 mb-2">Email</label>
            <input
              type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
                placeholder="Enter your email"
            />
          </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-blue-800 mb-2">Description</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 h-32"
                required
                placeholder="Describe your issue in detail..."
            ></textarea>
          </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit Help Request
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Help;
