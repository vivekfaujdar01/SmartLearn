const BASE_URL = import.meta.env.VITE_API_URL + "/enrollments";

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
        throw new Error(data.message || "Failed to check enrollment"); // Or handle gracefully
        return { isEnrolled: false };
    }
    return data;
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
