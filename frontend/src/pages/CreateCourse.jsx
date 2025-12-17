import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, DollarSign, Image as ImageIcon, Layout, Type, Save } from "lucide-react";
import { toast } from "sonner";
import { createCourse } from "../services/courseService";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    price: 0,
    category: "Development",
    thumbnailUrl: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCourse(formData);
      toast.success("Course created successfully!");
      navigate("/instructor/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/instructor/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold">Create New Course</h1>
          <p className="text-muted-foreground">Fill in the details to publish your course</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" /> Course Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Advanced React Patterns"
              required
              className="w-full p-3 border rounded-xl bg-card"
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Layout className="w-4 h-4 text-primary" /> Short Description
            </label>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief summary for the course card..."
              className="w-full p-3 border rounded-xl bg-card"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Detailed Description
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="What will students learn?"
              className="w-full p-3 border rounded-xl bg-card resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Price (INR)
              </label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-card"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Layout className="w-4 h-4 text-primary" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-card"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="AI/ML">AI/ML</option>
              </select>
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Thumbnail URL
            </label>
            <input
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 border rounded-xl bg-card"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 gradient-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-5 h-5" /> Create Course
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
