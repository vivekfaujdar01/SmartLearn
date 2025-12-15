import { ChevronLeft, ChevronRight } from "lucide-react";

export function CoursePagination({ params, meta, coursesCount, onPageChange }) {
  if (meta.pages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.pages) {
      onPageChange(newPage);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const total = meta.pages;
    const current = params.page;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, "...", total);
      } else if (current >= total - 2) {
        pages.push(1, "...", total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 animate-fade-in" style={{ animationDelay: "300ms" }}>
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(params.page - 1)}
        disabled={params.page === 1}
        className="group flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-card border border-border text-foreground hover:border-primary hover:bg-primary/5 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full font-medium transition-all duration-300 ${
                params.page === page
                  ? "bg-primary text-primary-foreground shadow-lg scale-110"
                  : "bg-card border border-border text-foreground hover:border-primary hover:bg-primary/5"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 text-muted-foreground">
              {page}
            </span>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(params.page + 1)}
        disabled={params.page === meta.pages}
        className="group flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
      >
        Next
        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* Results Info */}
      <div className="hidden lg:block text-sm text-muted-foreground ml-4 pl-4 border-l border-border">
        Showing <span className="font-semibold text-foreground">{coursesCount}</span> of{" "}
        <span className="font-semibold text-foreground">{meta.total}</span> courses
      </div>
    </div>
  );
}
