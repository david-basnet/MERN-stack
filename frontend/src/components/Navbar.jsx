import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import Login from "../pages/Login";

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Use the custom hook to access the auth state

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page
  };

  return (
    <>
      <div className="navbar fixed top-0 left-0 w-full bg-gradient-to-r from-blue-800 to-black text-white shadow-md z-50">
        <div className="navbar-start">
          <a className="btn btn-ghost text-3xl font-bold text-white">Tech Class Nepal</a>
        </div>
        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1 space-x-8">
            <li>
              <Link to="/" className="text-lg text-white hover:text-blue-300">
                Home
              </Link>
            </li>

            {/* Display "Assignments" link if the user is logged in */}
            {user && (
              <li>
                <Link to="/assignments" className="text-lg text-white hover:text-blue-300">
                  Assignments
                </Link>
              </li>
            )}

            <li>
              <Link to="/help" className="text-lg text-white hover:text-blue-300">
                Help
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="text-lg text-white hover:text-blue-300">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end flex items-center mr-2 space-x-8">
          {!user ? (
            <button
              onClick={() => setIsLoginOpen(true)} // Open the login modal
              className="btn text-lg text-white bg-[rgba(0,0,139,1)] hover:bg-blue-700"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout} // Logout functionality
              className="btn text-lg text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          )}

          {user && (
            <Link to="/profile">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                <span className="text-white text-xl font-semibold">
                  {user.name ? user.name[0] : "U"}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}

export default Navbar;
