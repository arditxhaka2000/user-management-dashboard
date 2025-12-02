import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
