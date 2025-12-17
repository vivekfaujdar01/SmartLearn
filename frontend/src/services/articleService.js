const BASE_URL = import.meta.env.VITE_API_URL + "/articles";
const ADMIN_URL = import.meta.env.VITE_API_URL + "/admin/articles";

export const fetchArticles = async (token = null, isAdmin = false) => {
    const url = isAdmin ? ADMIN_URL : BASE_URL;
    const headers = {};

    if (isAdmin && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch articles");
    }

    return data;
};
