import { useMemo, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import type { User } from '../../types';
import { Pagination } from '../common/Pagination';
import { useToast } from '../common/Toast';

interface UserTableProps {
  onEdit: (user: User) => void;
}

// Generate avatar color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-rose-500 to-pink-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Get initials from name
const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Gender badge color
const getGenderBadgeColor = (gender: string): string => {
  switch (gender.toLowerCase()) {
    case 'male':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'female':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800';
    case 'non-binary':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800';
  }
};

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

  const { notify } = useToast();

  const filteredAndSorted = useMemo(() => {
    let result = users;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
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

  const { pageSize } = preferences;
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const currentPageUsers = filteredAndSorted.slice(start, start + pageSize);

  useEffect(() => {
    if (page > totalPages || (filteredAndSorted.length > 0 && currentPageUsers.length === 0)) {
      setPage(1);
    }
  }, [filteredAndSorted.length, currentPageUsers.length, totalPages, page, setPage]);

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
  const allSelectedOnPage = currentPageUsers.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

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

  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      deleteUser(user.id);
      notify(`Deleted ${user.first_name} ${user.last_name}`, 'success');
    }
  };

  const columns: Array<{ field: keyof User; label: string; width?: string }> = [
    { field: 'first_name', label: 'Name', width: 'w-64' },
    { field: 'email', label: 'Email', width: 'flex-1' },
    { field: 'gender', label: 'Gender', width: 'w-32' },
    { field: 'ip_address', label: 'IP Address', width: 'w-40' },
  ];

  if (currentPageUsers.length === 0) {
    return (
      <div className="rounded-2xl bg-[rgb(var(--card))] border-2 border-[rgb(var(--card-border))] shadow-lg p-12 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No users found</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Try adjusting your search or filters to find what you're looking for
        </p>
        <button
          onClick={() => {
            clearSelection();
            setPage(1);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[rgb(var(--accent))] to-[rgb(var(--accent-hover))] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[rgb(var(--card))] border-2 border-[rgb(var(--card-border))] shadow-lg overflow-hidden animate-fade-in">
      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-b-2 border-[rgb(var(--card-border))]">
            <tr>
              <th className="px-6 py-4 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={handleSelectAllChange}
                  className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 text-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 cursor-pointer"
                />
              </th>
              {columns.map(({ field, label, width }) => (
                <th
                  key={String(field)}
                  className={`px-6 py-4 text-left font-semibold cursor-pointer select-none hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${width || ''}`}
                  onClick={() => toggleSort(field)}
                >
                  <div className="flex items-center gap-2 group">
                    <span>{label}</span>
                    <div className={`flex flex-col transition-opacity ${sort.key === field ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                      <svg
                        className={`w-3 h-3 -mb-1 ${sort.key === field && sort.direction === 'asc' ? 'text-[rgb(var(--accent))]' : 'text-slate-400'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                      </svg>
                      <svg
                        className={`w-3 h-3 ${sort.key === field && sort.direction === 'desc' ? 'text-[rgb(var(--accent))]' : 'text-slate-400'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right font-semibold w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgb(var(--card-border))]">
            {currentPageUsers.map((user, idx) => (
              <tr
                key={user.id}
                className="table-row group"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 text-[rgb(var(--accent))] focus:ring-2 focus:ring-[rgb(var(--accent))]/20 cursor-pointer"
                  />
                </td>
                
                {/* Name with avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(user.first_name)} flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow`}>
                      {getInitials(user.first_name, user.last_name)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {user.first_name} {user.last_name}
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Email */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-600 dark:text-slate-400">{user.email}</span>
                  </div>
                </td>
                
                {/* Gender badge */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getGenderBadgeColor(user.gender)}`}>
                    {user.gender}
                  </span>
                </td>
                
                {/* IP Address */}
                <td className="px-6 py-4">
                  <code className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {user.ip_address}
                  </code>
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-lg border-2 border-[rgb(var(--card-border))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10 transition-all duration-200 hover:shadow-md"
                      title="Edit user"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 rounded-lg border-2 border-rose-200 dark:border-rose-800 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 transition-all duration-200 hover:shadow-md"
                      title="Delete user"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t-2 border-[rgb(var(--card-border))] bg-slate-50 dark:bg-slate-900/50">
        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}