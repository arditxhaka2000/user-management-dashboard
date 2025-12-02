import { useTheme } from '../../context/ThemeContext';

interface TopBarProps {
  onAddUserClick: () => void;
}

export function TopBar({ onAddUserClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Title section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
            User Management Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Search, manage, and visualize user data from CSV
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="group relative px-4 py-2.5 rounded-xl border-2 border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-sm font-medium flex items-center gap-2.5 hover:border-[rgb(var(--accent))] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            aria-label="Toggle theme"
          >
            <span className="text-lg transform group-hover:scale-110 transition-transform duration-300">
              {theme === 'light' ? '🌞' : '🌙'}
            </span>
            <span className="hidden sm:inline">{theme === 'light' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Add user button */}
          <button
            onClick={onAddUserClick}
            className="group relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-[rgb(var(--accent))] to-[rgb(var(--accent-hover))] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            <span className="relative flex items-center gap-2">
              <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add User</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}