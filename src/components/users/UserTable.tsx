import { useMemo, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import type { User } from '../../types';
import { Pagination } from '../common/Pagination';

interface UserTableProps {
  onEdit: (user: User) => void;
}

export function UserTable({ onEdit }: UserTableProps) {
  const {
    users,
    search,
    genderFilter,
    sort,
    setSort,
    page,
    setPage,
    preferences,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    deleteUser,
  } = useUserStore();

  const filteredAndSorted = useMemo(() => {
  let result = users;

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter((u) =>
      u.first_name.toLowerCase().includes(q) ||
      u.last_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.gender || '').toLowerCase().includes(q)
    );
  }

  if (genderFilter !== 'all') {
    result = result.filter((u) => u.gender === genderFilter);
  }

  if (sort.key) {
    const { key, direction } = sort;
    result = [...result].sort((a, b) => {
      const av = a[key!] ?? '';
      const bv = b[key!] ?? '';
      if (av < bv) return direction === 'asc' ? -1 : 1;
      if (av > bv) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return result;
}, [users, search, genderFilter, sort]);

// Pagination setup must run BEFORE the useEffect
const { pageSize } = preferences;
const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
const safePage = Math.min(page, totalPages);
const start = (safePage - 1) * pageSize;
const currentPageUsers = filteredAndSorted.slice(start, start + pageSize);

// ⬇️ useEffect AFTER variables exist
useEffect(() => {
  if (page > totalPages || (filteredAndSorted.length > 0 && currentPageUsers.length === 0)) {
    setPage(1);
  }
}, [filteredAndSorted.length, currentPageUsers.length, totalPages]);


  const toggleSort = (key: keyof User) => {
    if (sort.key === key) {
      setSort({
        key,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSort({ key, direction: 'asc' });
    }
  };

  const allVisibleIds = currentPageUsers.map((u) => u.id);
  const allSelectedOnPage = allVisibleIds.every((id) =>
    selectedIds.has(id),
  );

  const handleSelectAllChange = () => {
    if (allSelectedOnPage) {
      const next = new Set(selectedIds);
      allVisibleIds.forEach((id) => next.delete(id));
      clearSelection();
      selectAll([...next]);
    } else {
      selectAll([...selectedIds, ...allVisibleIds]);
    }
  };

  return (
    <div className="rounded-2xl bg-[rgb(var(--card))] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-100/80 dark:bg-slate-800/80">
          <tr>
            <th className="px-3 py-2 text-left">
              <input
                type="checkbox"
                checked={allSelectedOnPage && currentPageUsers.length > 0}
                onChange={handleSelectAllChange}
              />
            </th>
            {(
              [
                ['first_name', 'First name'],
                ['last_name', 'Last name'],
                ['email', 'Email'],
                ['gender', 'Gender'],
                ['ip_address', 'IP address'],
              ] as [keyof User, string][]
            ).map(([key, label]) => (
              <th
                key={key}
                className="px-3 py-2 text-left cursor-pointer select-none"
                onClick={() => toggleSort(key)}
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  {sort.key === key && (
                    <span>{sort.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPageUsers.map((user) => (
            <tr
              key={user.id}
              className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors"
            >
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(user.id)}
                  onChange={() => toggleSelect(user.id)}
                />
              </td>
              <td className="px-3 py-2">{user.first_name}</td>
              <td className="px-3 py-2">{user.last_name}</td>
              <td className="px-3 py-2">{user.email}</td>
              <td className="px-3 py-2">{user.gender}</td>
              <td className="px-3 py-2 font-mono text-xs">
                {user.ip_address}
              </td>
              <td className="px-3 py-2 text-right space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="px-2 py-1 rounded-full bg-rose-500 text-white text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {currentPageUsers.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-3 py-8 text-center text-slate-500"
              >
                No users match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="px-3 pb-3">
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
