interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (page > 3) {
      pages.push('...');
    }

    // Show pages around current
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-6 text-sm">
      <div className="text-slate-600 dark:text-slate-400 font-medium">
        Page <span className="font-bold text-[rgb(var(--accent))]">{page}</span> of{' '}
        <span className="font-bold">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className="px-4 py-2 rounded-xl border-2 border-[rgb(var(--card-border))] bg-[rgb(var(--card))] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10 transition-all duration-200 font-medium flex items-center gap-2 hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((num, idx) => (
            <button
              key={idx}
              onClick={() => typeof num === 'number' && onPageChange(num)}
              disabled={num === '...'}
              className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                num === page
                  ? 'bg-gradient-to-br from-[rgb(var(--accent))] to-[rgb(var(--accent-hover))] text-white shadow-lg scale-110'
                  : num === '...'
                  ? 'cursor-default text-slate-400'
                  : 'border-2 border-[rgb(var(--card-border))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10 hover:scale-105'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className="px-4 py-2 rounded-xl border-2 border-[rgb(var(--card-border))] bg-[rgb(var(--card))] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10 transition-all duration-200 font-medium flex items-center gap-2 hover:shadow-md"
        >
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}