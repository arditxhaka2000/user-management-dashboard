import { useEffect, useState } from 'react';
import { Layout } from './components/layout/Layout';
import { TopBar } from './components/layout/TopBar';
import { UserFiltersBar } from './components/users/UserFiltersBar';
import { DashboardStats } from './components/users/DashboardStats';
import { DemographicsChart } from './components/users/DemographicsChart';
import { UserTable } from './components/users/UserTable';
import { UserFormModal } from './components/users/UserFormModal';
import { useUserStore } from './store/userStore';
import { fetchUsersFromCsv } from './utils/csv';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { useToast } from './components/common/Toast';
import type { User } from './types';

function App() {
  const {
    users,
    setUsers,
    loading,
    setLoading,
    error,
    setError,
    deleteSelected,
    selectedIds,
  } = useUserStore();

  const { notify } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // "/" focuses global search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        const input = document.getElementById('global-search') as HTMLInputElement | null;
        input?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Load CSV on first mount
  useEffect(() => {
    if (users.length > 0) return;

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchUsersFromCsv();
        if (!cancelled) {
          setUsers(data);
          setError(null);
          notify('Successfully loaded user data', 'success');
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to load users from CSV');
          notify('Failed to load user data', 'error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [users.length, setLoading, setError, setUsers, notify]);

  const handleAddUserClick = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleExportCsv = () => {
    const header = 'id,first_name,last_name,email,gender,ip_address';
    const rows = users.map((u) =>
      [u.id, u.first_name, u.last_name, u.email, u.gender, u.ip_address]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`Exported ${users.length} users to CSV`, 'success');
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`Exported ${users.length} users to JSON`, 'success');
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    if (count > 0) {
      deleteSelected();
      notify(`Deleted ${count} selected user${count > 1 ? 's' : ''}`, 'success');
    }
  };

  return (
    <Layout>
      <TopBar onAddUserClick={handleAddUserClick} />
      
      {loading && <LoadingSkeleton />}

      {error && (
        <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-2 border-rose-200 dark:border-rose-800 p-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-rose-900 dark:text-rose-100 mb-1">Error Loading Data</h3>
              <p className="text-sm text-rose-700 dark:text-rose-300 mb-3">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <DashboardStats />
          <UserFiltersBar
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
            onDeleteSelected={handleDeleteSelected}
          />
          <UserTable onEdit={handleEditUser} />
          <DemographicsChart />
        </>
      )}

      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editingUser={editingUser}
      />
    </Layout>
  );
}

export default App;