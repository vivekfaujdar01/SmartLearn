const BASE_URL = import.meta.env.VITE_API_URL + "/articles";
const ADMIN_URL = import.meta.env.VITE_API_URL + "/admin/articles";

export const fetchArticles = async (token = null, isAdmin = false, params = {}) => {
    let url = isAdmin ? ADMIN_URL : BASE_URL;

    // Add query params
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== 'All') searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);

    if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
    }

    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch articles");
    }

    return data;
};

export const likeArticle = async (id, token) => {
    const res = await fetch(`${BASE_URL}/${id}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const deleteArticle = async (id, token) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};


export const createArticle = async (data, token) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const respData = await res.json();
    if (!res.ok) throw new Error(respData.message);
    return respData;
};

export const getArticleById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const updateArticle = async (id, data, token) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    const respData = await res.json();
    if (!res.ok) throw new Error(respData.message);
    return respData;
};
