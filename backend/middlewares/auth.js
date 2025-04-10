const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Fetch the user from the database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Set the user object in the request
      req.user = user;
      console.log('User set in request:', req.user);
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if user is a teacher
const isTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user.role === "teacher") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Teacher privileges required." });
  }
};

// Middleware to check if user is a student
const isStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Student privileges required." });
  }
};

module.exports = { auth, isTeacher, isStudent };
