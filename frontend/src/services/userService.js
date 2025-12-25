// User Service - API functions for user profile operations
// Base URL for user endpoints
const BASE_URL = import.meta.env.VITE_API_URL + "/users";

// Fetch current user's profile data
// @returns Promise with user profile data (name, email, bio, etc.)
export const getUserProfile = async () => {
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    const res = await fetch(`${BASE_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}` // Include auth token for authentication
        }
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile"); // Throw error if fetch failed
    }

    return data; // Return user profile data on success
};

// Update current user's profile information
// @param userData - Object containing updated profile fields (name, bio, etc.)
// @returns Promise with updated user data
export const updateUserProfile = async (userData) => {
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    const res = await fetch(`${BASE_URL}/me`, {
        method: "PUT", // HTTP PUT for updating resource
        headers: {
            "Content-Type": "application/json", // Specify JSON content type
            Authorization: `Bearer ${token}` // Include auth token for authentication
        },
        body: JSON.stringify(userData) // Convert updated profile data to JSON string
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Failed to update profile"); // Throw error if update failed
    }

    return data; // Return updated user data on success
};

// Change current user's password
// @param passwordData - Object containing currentPassword and newPassword
// @returns Promise with success confirmation
export const changeUserPassword = async (passwordData) => {
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    const res = await fetch(`${BASE_URL}/change-password`, {
        method: "PUT", // HTTP PUT for updating password
        headers: {
            "Content-Type": "application/json", // Specify JSON content type
            Authorization: `Bearer ${token}` // Include auth token for authentication
        },
        body: JSON.stringify(passwordData) // Convert password data to JSON string
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Failed to change password"); // Throw error if password change failed
    }

    return data; // Return confirmation on success
};
