const BASE_URL = import.meta.env.VITE_API_URL + "/enrollments";
const PAYMENT_URL = import.meta.env.VITE_API_URL + "/payments";

export const enrollInCourse = async (courseId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Enrollment failed");
    }
    return data;
};

export const checkEnrollmentStatus = async (courseId) => {
    const token = localStorage.getItem("token");
    // If no token (not logged in), return false
    if (!token) return { isEnrolled: false };

    const res = await fetch(`${BASE_URL}/check/${courseId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to check enrollment");
    }
    return data;
};

export const getMyEnrollments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/my-courses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch enrollments");
    }
    return data;
};

// Razorpay Payment Functions

export const createPaymentOrder = async (courseId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${PAYMENT_URL}/create-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to create payment order");
    }
    return data;
};

export const verifyPayment = async (paymentData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${PAYMENT_URL}/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Payment verification failed");
    }
    return data;
};

export const getRazorpayKey = async () => {
    const res = await fetch(`${PAYMENT_URL}/key`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to get payment key");
    }
    return data.key;
};
