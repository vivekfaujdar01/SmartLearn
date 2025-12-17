const BASE_URL = import.meta.env.VITE_API_URL + "/courses";

export const listCourses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}?${query}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load courses");
  }

  return data;
};

export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(courseData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create course");
  }

  return data;
};

export const getCourseById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch course");
  }
  return data;
};

export const updateCourse = async (id, courseData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(courseData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update course");
  }

  return data;
};

export const deleteCourse = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete course");
  }

  return data;
};

export const addLesson = async (courseId, lessonData) => {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/lessons/course/${courseId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(lessonData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add lesson");
  }

  return data;
};

export const getLessonsByCourseId = async (courseId) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/lessons/course/${courseId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch lessons");
  }

  return data;
};