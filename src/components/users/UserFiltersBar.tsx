import { useUserStore } from '../../store/userStore';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';

interface UserFiltersBarProps {
  onExportCsv: () => void;
  onExportJson: () => void;
  onDeleteSelected: () => void;
}

export function UserFiltersBar({
  onExportCsv,
  onExportJson,
  onDeleteSelected,
}: UserFiltersBarProps) {
  const {
    search,
    setSearch,
    genderFilter,
    setGenderFilter,
    preferences,
    setPageSize,
    selectedIds,
    users,
  } = useUserStore();

  const [localSearch, setLocalSearch] = useState(search);
  const debounced = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearch(debounced);
  }, [debounced, setSearch]);

  const totalSelected = selectedIds.size;

  return (
    <div className="space-y-4 mb-6 animate-slide-in">
      {/* Search and filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[280px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, gender... (press / to focus)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-sm focus:border-[rgb(var(--accent))] transition-all duration-200 shadow-sm"
            id="global-search"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Gender filter */}
        <div className="relative">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl border-2 border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-sm font-medium cursor-pointer hover:border-[rgb(var(--accent))] transition-all duration-200 shadow-sm"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Page size */}
        <div className="relative">
          <select
            value={preferences.pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl border-2 border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-sm font-medium cursor-pointer hover:border-[rgb(var(--accent))] transition-all duration-200 shadow-sm"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-[rgb(var(--accent))]">{users.length}</span> users
          {totalSelected > 0 && (
            <span className="ml-2">
              · <span className="font-bold text-[rgb(var(--accent))]">{totalSelected}</span> selected
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Delete selected button */}
          {totalSelected > 0 && (
            <button
              onClick={onDeleteSelected}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete ({totalSelected})
            </button>
          )}

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="px-4 py-2 rounded-xl border-2 border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-sm font-medium hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10 transition-all duration-200 hover:shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={onExportJson}
            className="px-4 py-2 rounded-xl border-2 border-[rgb(var(--card-border))] bg-[rgb(var(--card))] text-sm font-medium hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10 transition-all duration-200 hover:shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
}