import { Star, Users, Play } from "lucide-react";

export function CourseCard({ course, index }) {
  return (
    <div
      className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 flex flex-col h-full animate-fade-in border border-border/50"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnailUrl || "https://via.placeholder.com/400x200?text=No+Thumbnail"}
          alt={course.title}
          className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm ${
              course.price === 0
                ? "bg-primary text-primary-foreground"
                : "bg-card/90 text-foreground"
            }`}
          >
            {course.price === 0 ? "FREE" : `$${course.price}`}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground capitalize">
            {course.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-lg text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {course.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {course.shortDescription}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{course.enrolledCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="pt-4 border-t border-border flex items-center gap-3">
          <img
            src={course.instructor.avatar || "https://i.pravatar.cc/150"}
            alt={course.instructor.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
          />
          <span className="text-sm text-muted-foreground">
            By <span className="font-medium text-card-foreground">{course.instructor.name}</span>
          </span>
        </div>
      </div>

      {/* Hover gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
