export function LoadingSkeleton() {
  return (
    <div className="space-y-4 mt-6 animate-fade-in">
      {/* Table header skeleton */}
      <div className="h-12 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 shimmer" />
      
      {/* Table rows skeleton */}
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="h-16 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 shimmer border border-slate-200/50 dark:border-slate-700/50"
          style={{ animationDelay: `${idx * 0.1}s` }}
        />
      ))}
      
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 animate-pulse">
        Loading user data...
      </div>
    </div>
  );
}