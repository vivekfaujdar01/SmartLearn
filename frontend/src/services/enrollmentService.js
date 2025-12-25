// Enrollment Service - API functions for course enrollment and payment operations
// Base URLs for enrollment and payment endpoints
const BASE_URL = import.meta.env.VITE_API_URL + "/enrollments";
const PAYMENT_URL = import.meta.env.VITE_API_URL + "/payments";

// Enroll user in a course directly (for free courses without payment)
// @param courseId - ID of the course to enroll in
// @returns Promise with enrollment confirmation
export const enrollInCourse = async (courseId) => {
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    const res = await fetch(BASE_URL, {
        method: "POST", // HTTP POST for creating enrollment
        headers: {
            "Content-Type": "application/json", // Specify JSON content type
            Authorization: `Bearer ${token}` // Include auth token
        },
        body: JSON.stringify({ courseId }) // Send course ID in request body
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Enrollment failed"); // Throw error if enrollment failed
    }
    return data; // Return enrollment confirmation on success
};

// Check if user is enrolled in a specific course
// @param courseId - ID of the course to check enrollment for
// @returns Promise with { isEnrolled: boolean }
export const checkEnrollmentStatus = async (courseId) => {
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    // If no token (not logged in), return false immediately
    if (!token) return { isEnrolled: false };

    const res = await fetch(`${BASE_URL}/check/${courseId}`, {
        headers: {
            Authorization: `Bearer ${token}` // Include auth token
        }
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Failed to check enrollment"); // Throw error if check failed
    }
    return data; // Return enrollment status on success
};

// Fetch all courses the current user is enrolled in
// @returns Promise with array of enrolled courses
export const getMyEnrollments = async () => {
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    const res = await fetch(`${BASE_URL}/my-courses`, {
        headers: {
            Authorization: `Bearer ${token}` // Include auth token
        }
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch enrollments"); // Throw error if fetch failed
    }
    return data; // Return enrolled courses on success
};

// ========== Razorpay Payment Functions ==========

// Create a Razorpay payment order for course enrollment
// @param courseId - ID of the course to purchase
// @returns Promise with Razorpay order details (order ID, amount, key) or { isFree: true } for free courses
export const createPaymentOrder = async (courseId) => {
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    const res = await fetch(`${PAYMENT_URL}/create-order`, {
        method: "POST", // HTTP POST for creating order
        headers: {
            "Content-Type": "application/json", // Specify JSON content type
            Authorization: `Bearer ${token}` // Include auth token
        },
        body: JSON.stringify({ courseId }) // Send course ID in request body
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Failed to create payment order"); // Throw error if order creation failed
    }
    return data; // Return order details on success
};

// Verify Razorpay payment after successful payment on frontend
// @param paymentData - Object containing razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId
// @returns Promise with enrollment confirmation after successful verification
export const verifyPayment = async (paymentData) => {
    const token = localStorage.getItem("token"); // Get auth token from localStorage
    const res = await fetch(`${PAYMENT_URL}/verify`, {
        method: "POST", // HTTP POST for verification
        headers: {
            "Content-Type": "application/json", // Specify JSON content type
            Authorization: `Bearer ${token}` // Include auth token
        },
        body: JSON.stringify(paymentData) // Send payment verification data
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Payment verification failed"); // Throw error if verification failed
    }
    return data; // Return confirmation on success
};

// Get Razorpay public key for initializing payment on frontend
// @returns Promise with Razorpay key ID
export const getRazorpayKey = async () => {
    const res = await fetch(`${PAYMENT_URL}/key`); // Make GET request for key
    const data = await res.json(); // Parse JSON response
    if (!res.ok) {
        throw new Error(data.message || "Failed to get payment key"); // Throw error if fetch failed
    }
    return data.key; // Return Razorpay key on success
};
