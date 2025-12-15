export function CourseLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-xl overflow-hidden border border-border/50 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Image skeleton */}
          <div className="w-full h-44 animate-shimmer" />

          {/* Content skeleton */}
          <div className="p-5 space-y-4">
            {/* Title */}
            <div className="h-6 bg-muted rounded-lg w-3/4" />
            
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-4 bg-muted rounded w-20" />
            </div>

            {/* Instructor */}
            <div className="pt-4 border-t border-border flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
