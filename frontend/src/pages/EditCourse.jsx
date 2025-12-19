import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getCourseById, updateCourse } from "../services/courseService";

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/instructor/dashboard";
  
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    price: 0,
    category: "Development",
    thumbnailUrl: "",
    published: false
  });

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setFormData({
          title: data.course.title,
          shortDescription: data.course.shortDescription,
          description: data.course.description,
          price: data.course.price,
          category: data.course.category,
          thumbnailUrl: data.course.thumbnailUrl,
          published: data.course.published
        });
      } catch (err) {
        toast.error("Failed to load course details");
        navigate(dashboardPath);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateCourse(courseId, formData);
      toast.success("Course updated successfully!");
      navigate(dashboardPath);
    } catch (err) {
      toast.error(err.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <Link to={dashboardPath} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold">Edit Course</h1>
          <p className="text-muted-foreground">Update your course details</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Info</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Course Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl bg-card"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-card text-foreground [&>option]:bg-card [&>option]:text-foreground"
                >
                  {["Development", "Business", "Design", "Marketing", "Lifestyle"].map(c => (
                    <option key={c} value={c} className="bg-card text-foreground">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border rounded-xl bg-card"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Details</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <input
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                maxLength={150}
                className="w-full p-3 border rounded-xl bg-card"
              />
              <p className="text-xs text-muted-foreground text-right">{formData.shortDescription.length}/150</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Detailed Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full p-3 border rounded-xl bg-card resize-none"
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Media</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" /> Thumbnail URL
              </label>
              <input
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border rounded-xl bg-card"
              />
            </div>
          </div>

          {/* Status Section */}
           <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-xl border">
            <input 
              type="checkbox" 
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="published" className="text-sm font-medium cursor-pointer select-none">
              Publish this course (Visible to students)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || saving}
            className="w-full py-4 gradient-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-5 h-5" /> Update Course
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
