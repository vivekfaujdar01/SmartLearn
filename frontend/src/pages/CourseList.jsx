
import React, { useState, useEffect, useCallback } from "react";
import { listCourses } from "../services/courseService";


const CourseCard = ({ course }) => (
  <div className="course-card border p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col h-full bg-white">
    <img 
      src={course.thumbnailUrl || 'https://via.placeholder.com/400x200?text=No+Thumbnail'} 
      alt={course.title} 
      className="w-full h-40 object-cover rounded-md mb-3 flex-shrink-0"
    />
    <h3 className="text-xl font-semibold mb-1 truncate">{course.title}</h3>
    <p className="text-sm text-gray-500 mb-2 flex-grow overflow-hidden">{course.shortDescription}</p>
    <div className="mt-auto pt-3 border-t flex justify-between items-center text-sm">
      <span className="text-indigo-600 font-bold text-lg">
        {course.price === 0 ? "FREE" : `$${course.price}`}
      </span>
      <span className="text-gray-500 text-xs">
        By: {course.instructor?.name || 'N/A'}
      </span>
    </div>
  </div>
);


export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const [params, setParams] = useState({
    page: 1,
    limit: 8, 
    search: '',
    category: '',
    price: '',
    sort: 'createdAt:desc',
  });

  
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const validatedParams = { ...params, page: parseInt(params.page, 10) };
    
    try {
      const data = await listCourses(validatedParams);
      setCourses(data.courses);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);


  const handleParamChange = (field, value) => {
    setParams(prev => ({
      ...prev,
      [field]: value,
      ...(field !== 'page' && { page: 1 }), 
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.pages) {
      handleParamChange('page', newPage);
    }
  };

  
  if (loading) return <div className="text-center p-10 text-xl font-semibold">Loading courses...</div>;
  if (error) return <div className="text-center p-10 text-xl text-red-600 bg-red-50 border border-red-200 rounded-lg mx-auto max-w-lg">Failed to load courses: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b pb-2">Course Catalog</h1>

     
      <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
         
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Courses</label>
            <input
              type="text"
              placeholder="Title or Description..."
              className="w-full border p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={params.search}
              onChange={(e) => handleParamChange('search', e.target.value)}
            />
          </div>
          
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full border p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={params.category}
              onChange={(e) => handleParamChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="database">Database</option>
            </select>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <select 
              className="w-full border p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={params.price}
              onChange={(e) => handleParamChange('price', e.target.value)}
            >
              <option value="">All</option>
              <option value="free">Free Only</option>
              <option value="paid">Paid Only</option>
            </select>
          </div>
        </div>
        
        
        <div className="mt-4 pt-4 border-t">
          <label className="text-sm font-medium text-gray-700 mr-3">Sort By:</label>
          <select
            className="border p-1 rounded-lg"
            value={params.sort}
            onChange={(e) => handleParamChange('sort', e.target.value)}
          >
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="title:asc">Title (A-Z)</option>
          </select>
        </div>
      </div>

      
      {courses.length === 0 && !loading ? (
        <p className="text-center text-xl text-gray-500 p-10 border rounded-lg">No courses found matching your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}

      
      {meta.pages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 mt-10 p-4 bg-gray-50 rounded-lg shadow-inner">
          <button
            onClick={() => handlePageChange(params.page - 1)}
            disabled={params.page === 1}
            className="px-4 py-2 border rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            ← Previous
          </button>
          
          <span className="text-base text-gray-700">
            Page **{params.page}** of **{meta.pages}** | Showing {courses.length} of {meta.total} results
          </span>
          
          <button
            onClick={() => handlePageChange(params.page + 1)}
            disabled={params.page === meta.pages}
            className="px-4 py-2 border rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}