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

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-slate-600 dark:text-slate-300">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="space-x-2">
        <button
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
