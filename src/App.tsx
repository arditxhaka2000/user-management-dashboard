// src/App.tsx
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
  } = useUserStore();

  const { notify } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // "/" focuses global search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        const input = document.getElementById(
          'global-search',
        ) as HTMLInputElement | null;
        input?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // 🔥 Load CSV on first mount
  useEffect(() => {
    if (users.length > 0) return; // already loaded

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchUsersFromCsv();
        if (!cancelled) {
          setUsers(data);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to load users from CSV');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [users.length, setLoading, setError, setUsers]);

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
    a.download = 'users_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('Exported CSV', 'success');
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.json';
    a.click();
    URL.revokeObjectURL(url);
    notify('Exported JSON', 'success');
  };

  const handleDeleteSelected = () => {
    if (
      window.confirm('Are you sure you want to delete all selected users?')
    ) {
      deleteSelected();
      notify('Deleted selected users', 'success');
    }
  };

  return (
    <Layout>
      <TopBar onAddUserClick={handleAddUserClick} />
      <DashboardStats />
      <UserFiltersBar
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        onDeleteSelected={handleDeleteSelected}
      />

      {loading && <LoadingSkeleton />}

      {error && (
        <div className="mt-3 text-sm text-rose-500">
          {error}{' '}
          <button
            onClick={() => window.location.reload()}
            className="underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
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
