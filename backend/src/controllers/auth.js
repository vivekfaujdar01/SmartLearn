import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Prevent role abuse
    // Role assignment with Admin Secret check
    const requestedRole = (role || "").toLowerCase();
    let userRole = "student";

    if (requestedRole === "admin") {
      // Only allow admin if secret matches and is set
      if (process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET) {
        userRole = "admin";
      }
    } else if (["student", "instructor"].includes(requestedRole)) {
      userRole = requestedRole;
    }

    // Create user (password hashed by model)
    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    const token = signToken(user);

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
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password, adminSecret } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Require Admin Secret for admin login
    if (user.role === 'admin') {
      if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Admin authentication failed: Invalid or missing secret" });
      }
    }

    const token = signToken(user);

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
    res.status(500).json({ message: "Server error" });
  }
};
