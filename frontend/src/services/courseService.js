
const BASE_URL = "http://localhost:8000/api/courses";

export const listCourses = async (params = {}) => {
 
  const queryString = new URLSearchParams(params).toString();
  
  const res = await fetch(`${BASE_URL}?${queryString}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch courses");
  }

  return data;
};