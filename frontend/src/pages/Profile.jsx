import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setError(error.message || "Failed to change password");
    }
  };

  const handleInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 mt-16">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl p-6 hidden md:block">
        <h2 className="text-2xl font-semibold text-blue-800 mb-8">Settings</h2>
        <ul>
          <li className="mb-6">
            <button
              onClick={() => setShowChangePassword(false)}
              className="text-lg text-blue-800 hover:text-blue-600"
            >
              My Profile
            </button>
          </li>
          <li className="mb-6">
            <button
              onClick={() => setShowChangePassword(true)}
              className="text-lg text-blue-800 hover:text-blue-600"
            >
              Security
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-lg text-red-600 hover:text-red-500"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {!showChangePassword ? (
          <>
            <h1 className="text-3xl font-semibold text-blue-800 mb-6">My Profile</h1>
            
            <div className="flex items-center space-x-8 mb-6">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                <img
                  src={user?.profilePicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-lg font-semibold text-gray-800">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={user?.name || "Unknown User"}
                    className="w-full p-3 mt-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-lg font-semibold text-gray-800">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || "No email provided"}
                    className="w-full p-3 mt-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none"
                    disabled
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-blue-800 mb-6">Change Password</h1>
            
            <form onSubmit={handlePasswordChange} className="max-w-md">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  {success}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-lg font-semibold text-gray-800">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showCurrentPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-lg font-semibold text-gray-800">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-lg font-semibold text-gray-800">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Change Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
