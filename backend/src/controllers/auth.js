// Authentication Controller - Handles user registration and login
import jwt from "jsonwebtoken"; // JSON Web Token library for creating auth tokens
import User from "../models/User.js"; // User model for database operations

// Generate JWT token with user ID and role
// @param user - User document from database
// @returns JWT token string with 7-day expiration
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Payload: user ID and role for authorization
    process.env.JWT_SECRET, // Secret key from environment variables
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Token expiration time
  );
};

// ================= REGISTER =================
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body; // Extract registration data from request body

    // Validation - ensure required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" }); // 409 Conflict status
    }

    // Prevent role abuse - Role assignment with Admin Secret check
    const requestedRole = (role || "").toLowerCase(); // Normalize role to lowercase
    let userRole = "student"; // Default role is student

    if (requestedRole === "admin") {
      // Only allow admin role if secret matches environment variable
      if (process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET) {
        userRole = "admin";
      }
      // If secret doesn't match, silently fall back to student role (security measure)
    } else if (["student", "instructor"].includes(requestedRole)) {
      userRole = requestedRole; // Allow student or instructor roles without secret
    }

    // Create user document (password is hashed automatically by model pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    const token = signToken(user); // Generate JWT token for immediate authentication

    // Return success response with token and user data (excluding password)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" }); // Generic error to prevent information leakage
  }
};

// ================= LOGIN =================
// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, adminSecret } = req.body; // Extract login credentials

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user by email and include password field (normally excluded by default)
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" }); // Generic message to prevent enumeration
    }

    // Require Admin Secret for admin login - additional security layer
    if (user.role === 'admin') {
      if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Admin authentication failed: Invalid or missing secret" });
      }
    }

    const token = signToken(user); // Generate JWT token

    // Return success response with token and user data
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" }); // Generic error to prevent information leakage
  }
};
