// Course Service - API functions for course-related operations
// Base URL constructed from environment variable for API calls
const BASE_URL = import.meta.env.VITE_API_URL + "/courses";

// Fetch list of courses with optional filtering parameters
// @param params - Object containing search, category, etc. for filtering
// @returns Promise with courses data
export const listCourses = async (params = {}) => {
  const query = new URLSearchParams(params).toString(); // Convert params object to URL query string
  const res = await fetch(`${BASE_URL}?${query}`); // Make GET request with query params
  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Failed to load courses"); // Throw error if request failed
  }

  return data; // Return courses data on success
};

// Create a new course (requires authentication)
// @param courseData - Object containing course details (title, description, etc.)
// @returns Promise with created course data
export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token"); // Get auth token from localStorage
  const res = await fetch(BASE_URL, {
    method: "POST", // HTTP POST for creating resource
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
      Authorization: `Bearer ${token}` // Include auth token in header
    },
    body: JSON.stringify(courseData) // Convert course data to JSON string
  });

  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Failed to create course"); // Throw error if request failed
  }

  return data; // Return created course data on success
};

// Fetch a single course by its ID
// @param id - Course ID to fetch
// @returns Promise with course data
export const getCourseById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`); // Make GET request for specific course
  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch course"); // Throw error if request failed
  }
  return data; // Return course data on success
};

// Update an existing course (requires authentication)
// @param id - Course ID to update
// @param courseData - Object containing updated course details
// @returns Promise with updated course data
export const updateCourse = async (id, courseData) => {
  const token = localStorage.getItem("token"); // Get auth token from localStorage
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT", // HTTP PUT for updating resource
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
      Authorization: `Bearer ${token}` // Include auth token in header
    },
    body: JSON.stringify(courseData) // Convert updated data to JSON string
  });

  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Failed to update course"); // Throw error if request failed
  }

  return data; // Return updated course data on success
};

// Delete a course (requires authentication)
// @param id - Course ID to delete
// @returns Promise with deletion confirmation
export const deleteCourse = async (id) => {
  const token = localStorage.getItem("token"); // Get auth token from localStorage
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE", // HTTP DELETE for removing resource
    headers: {
      Authorization: `Bearer ${token}` // Include auth token in header
    }
  });

  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete course"); // Throw error if request failed
  }

  return data; // Return confirmation on success
};

// Add a lesson to a course (requires authentication)
// @param courseId - ID of the course to add lesson to
// @param lessonData - Object containing lesson details (title, content, videoUrl, etc.)
// @returns Promise with created lesson data
export const addLesson = async (courseId, lessonData) => {
  const token = localStorage.getItem("token"); // Get auth token from localStorage
  const API_URL = import.meta.env.VITE_API_URL; // Get base API URL
  const res = await fetch(`${API_URL}/lessons/course/${courseId}`, {
    method: "POST", // HTTP POST for creating resource
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
      Authorization: `Bearer ${token}` // Include auth token in header
    },
    body: JSON.stringify(lessonData) // Convert lesson data to JSON string
  });

  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Failed to add lesson"); // Throw error if request failed
  }

  return data; // Return created lesson data on success
};

// Fetch all lessons for a specific course
// @param courseId - ID of the course to fetch lessons for
// @returns Promise with lessons array
export const getLessonsByCourseId = async (courseId) => {
  const API_URL = import.meta.env.VITE_API_URL; // Get base API URL
  const res = await fetch(`${API_URL}/lessons/course/${courseId}`); // Make GET request for course lessons
  const data = await res.json(); // Parse JSON response

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch lessons"); // Throw error if request failed
  }

  return data; // Return lessons data on success
};

// Delete a lesson (requires authentication)
// @param lessonId - ID of the lesson to delete
// @returns Promise with deletion confirmation
export const deleteLesson = async (lessonId) => {
  const token = localStorage.getItem("token"); // Get auth token from localStorage
  const API_URL = import.meta.env.VITE_API_URL; // Get base API URL
  const res = await fetch(`${API_URL}/lessons/${lessonId}`, {
    method: "DELETE", // HTTP DELETE for removing resource
    headers: {
      Authorization: `Bearer ${token}` // Include auth token in header
    }
  });

  const data = await res.json(); // Parse JSON response
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete lesson"); // Throw error if request failed
  }
  return data; // Return confirmation on success
};