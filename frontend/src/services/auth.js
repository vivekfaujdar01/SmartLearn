// Authentication Service - API functions for user authentication
// Base URL for auth endpoints
const BASE_URL = import.meta.env.VITE_API_URL + "/auth";

// REGISTER - Create a new user account
// @param formData - Object containing user registration details (name, email, password, role)
// @returns Promise with user data and token on successful registration
export const registerUser = async (formData) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST", // HTTP POST for creating new user
    headers: { "Content-Type": "application/json" }, // Specify JSON content type
    body: JSON.stringify(formData) // Convert form data to JSON string
  });

  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Registration failed"); // Throw error if registration failed
  }

  return data; // Return user data and token on success
};

// LOGIN - Authenticate existing user
// @param email - User's email address
// @param password - User's password
// @param adminSecret - Optional admin secret for admin login verification
// @returns Promise with user data and JWT token on successful login
export const loginUser = async (email, password, adminSecret) => {
  const reqBody = { email, password }; // Create request body with credentials
  if (adminSecret) reqBody.adminSecret = adminSecret; // Add admin secret if provided for admin authentication

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST", // HTTP POST for authentication
    headers: { "Content-Type": "application/json" }, // Specify JSON content type
    body: JSON.stringify(reqBody) // Convert credentials to JSON string
  });

  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Login failed"); // Throw error if login failed
  }

  return data; // Return user data and token on success
};
