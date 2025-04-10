const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Validate input
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["teacher", "student"].includes(role)) {
    return res.status(400).json({ message: "Invalid role. Choose teacher or student." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // Return success message without token
    res.status(201).json({
      message: "User registered successfully. Please login with your credentials."
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        field: !email ? "email" : "password"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password",
        field: "email"
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: "Invalid email or password",
        field: "password"
      });
    }

    // Create token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
};

const logout = async (req, res) => {
  res.json({ message: "User logged out successfully." });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long" });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "New password must be different from current password" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
};

module.exports = { signup, login, getProfile, logout, changePassword };