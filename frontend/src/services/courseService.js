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