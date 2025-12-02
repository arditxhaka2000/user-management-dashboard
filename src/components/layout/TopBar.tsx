import { useTheme } from '../../context/ThemeContext';

interface TopBarProps {
  onAddUserClick: () => void;
}

export function TopBar({ onAddUserClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Search, manage, and visualize user data from CSV.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-full border border-slate-300 dark:border-slate-600 px-3 py-1 text-sm flex items-center gap-2"
        >
          <span>{theme === 'light' ? '🌞' : '🌙'}</span>
          <span>{theme === 'light' ? 'Light' : 'Dark'} mode</span>
        </button>
        <button
          onClick={onAddUserClick}
          className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-medium shadow hover:bg-blue-600 active:scale-[0.98] transition"
        >
          + Add User
        </button>
      </div>
    </header>
  );
}
