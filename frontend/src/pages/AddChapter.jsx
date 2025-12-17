import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Video, Clock, FileText, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { addLesson } from "../services/courseService";

export default function AddChapter() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    videoUrl: "",
    duration: 10,
    isFree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addLesson(courseId, formData);
      toast.success("Chapter added successfully!");
      // Option: Stay to add more or go back
      navigate("/instructor/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to add chapter");
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
          <h1 className="text-3xl font-display font-bold">Add New Chapter</h1>
          <p className="text-muted-foreground">Add content to your course</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Chapter Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Variables"
              required
              className="w-full p-3 border rounded-xl bg-card"
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" /> Video URL
            </label>
            <input
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://vimeo.com/..."
              className="w-full p-3 border rounded-xl bg-card"
            />
          </div>

           {/* Duration */}
           <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-card"
            />
          </div>

          {/* Content / Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Content / Notes
            </label>
            <textarea
              name="content"
              rows={4}
              value={formData.content}
              onChange={handleChange}
              placeholder="Supplemental notes for this chapter..."
              className="w-full p-3 border rounded-xl bg-card resize-none"
            />
          </div>

          {/* Free Preview Toggle */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isFree"
              name="isFree"
              checked={formData.isFree}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isFree" className="text-sm cursor-pointer select-none">
              Allow as Free Preview
            </label>
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
                <Save className="w-5 h-5" /> Add Chapter
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
