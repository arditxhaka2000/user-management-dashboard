export function LoadingSkeleton() {
  return (
    <div className="space-y-3 mt-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="h-10 rounded-xl bg-slate-200/70 dark:bg-slate-700/70 animate-pulse"
        />
      ))}
    </div>
  );
}
