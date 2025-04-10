import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const [showModal, setShowModal] = useState(true); // Show modal on mount
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    localStorage.removeItem("user"); // Clear user session
    navigate("/"); // Redirect to home page
  };

  const handleCancelLogout = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
              onClick={handleCancelLogout}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
              Are you sure you want to log out?
            </h2>

            {/* Confirmation Buttons */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleConfirmLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelLogout}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Logout;
