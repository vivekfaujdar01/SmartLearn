// Article Service - API functions for article-related operations
// Base URLs for regular article endpoints and admin-specific endpoints
const BASE_URL = import.meta.env.VITE_API_URL + "/articles";
const ADMIN_URL = import.meta.env.VITE_API_URL + "/admin/articles";

// Fetch articles with optional filtering and pagination
// @param token - Auth token for authenticated requests (optional)
// @param isAdmin - If true, uses admin endpoint to fetch all articles including unapproved
// @param params - Object containing category and search filters
// @returns Promise with articles array
export const fetchArticles = async (token = null, isAdmin = false, params = {}) => {
    let url = isAdmin ? ADMIN_URL : BASE_URL; // Use admin URL if admin, otherwise regular URL

    // Build query parameters for filtering
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== 'All') searchParams.append('category', params.category); // Add category filter
    if (params.search) searchParams.append('search', params.search); // Add search query

    // Append query string if any filters are applied
    if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
    }

    const headers = {}; // Initialize headers object

    // Add authorization header if token is provided
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers }); // Make GET request with headers
    const data = await res.json(); // Parse JSON response

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch articles"); // Throw error if request failed
    }

    return data; // Return articles data on success
};

// Toggle like on an article (requires authentication)
// @param id - Article ID to like/unlike
// @param token - Auth token for authentication
// @returns Promise with updated likes count and isLiked status
export const likeArticle = async (id, token) => {
    const res = await fetch(`${BASE_URL}/${id}/like`, {
        method: 'POST', // HTTP POST to toggle like
        headers: {
            'Authorization': `Bearer ${token}`, // Include auth token
            'Content-Type': 'application/json' // Specify JSON content type
        }
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) throw new Error(data.message); // Throw error if request failed
    return data; // Return updated like data on success
};

// Delete an article (requires authentication and ownership/admin)
// @param id - Article ID to delete
// @param token - Auth token for authentication
// @returns Promise with deletion confirmation
export const deleteArticle = async (id, token) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE', // HTTP DELETE for removing resource
        headers: {
            'Authorization': `Bearer ${token}` // Include auth token
        }
    });

    const data = await res.json(); // Parse JSON response
    if (!res.ok) throw new Error(data.message); // Throw error if request failed
    return data; // Return confirmation on success
};


// Create a new article (requires authentication)
// @param data - Object containing article details (title, content, category, etc.)
// @param token - Auth token for authentication
// @returns Promise with created article data
export const createArticle = async (data, token) => {
    const res = await fetch(BASE_URL, {
        method: 'POST', // HTTP POST for creating resource
        headers: {
            'Content-Type': 'application/json', // Specify JSON content type
            'Authorization': `Bearer ${token}` // Include auth token
        },
        body: JSON.stringify(data) // Convert article data to JSON string
    });

    const respData = await res.json(); // Parse JSON response
    if (!res.ok) throw new Error(respData.message); // Throw error if request failed
    return respData; // Return created article data on success
};

// Fetch a single article by its ID
// @param id - Article ID to fetch
// @returns Promise with article data
export const getArticleById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`); // Make GET request for specific article
    const data = await res.json(); // Parse JSON response
    if (!res.ok) throw new Error(data.message); // Throw error if request failed
    return data; // Return article data on success
};

// Update an existing article (requires authentication and ownership/admin)
// @param id - Article ID to update
// @param data - Object containing updated article details
// @param token - Auth token for authentication
// @returns Promise with updated article data
export const updateArticle = async (id, data, token) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT', // HTTP PUT for updating resource
        headers: {
            'Content-Type': 'application/json', // Specify JSON content type
            'Authorization': `Bearer ${token}` // Include auth token
        },
        body: JSON.stringify(data) // Convert updated data to JSON string
    });
    const respData = await res.json(); // Parse JSON response
    if (!res.ok) throw new Error(respData.message); // Throw error if request failed
    return respData; // Return updated article data on success
};
