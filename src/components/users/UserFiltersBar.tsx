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
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search name, email, gender… (press / to focus)"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm min-w-[220px]"
          id="global-search"
        />
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
        >
          <option value="all">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
        </select>
        <select
          value={preferences.pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        {totalSelected > 0 && (
          <button
            onClick={onDeleteSelected}
            className="px-3 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
          >
            Delete selected ({totalSelected})
          </button>
        )}
        <button
          onClick={onExportCsv}
          className="px-3 py-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        >
          Export CSV ({users.length})
        </button>
        <button
          onClick={onExportJson}
          className="px-3 py-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}
