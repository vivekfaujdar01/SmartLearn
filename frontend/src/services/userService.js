const BASE_URL = import.meta.env.VITE_API_URL + "/users";

export const getUserProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
    }

    return data;
};

export const updateUserProfile = async (userData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
    }

    return data;
};

export const changeUserPassword = async (passwordData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
    }

    return data;
};
