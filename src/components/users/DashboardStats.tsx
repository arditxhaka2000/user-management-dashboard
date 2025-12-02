import { useMemo } from 'react';
import { useUserStore } from '../../store/userStore';

export function DashboardStats() {
  const { users } = useUserStore();

  const stats = useMemo(() => {
    const total = users.length;
    const byGender = users.reduce<Record<string, number>>((acc, user) => {
      const key = user.gender || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const uniqueIps = new Set(users.map((u) => u.ip_address)).size;

    return { total, byGender, uniqueIps };
  }, [users]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="rounded-2xl bg-[rgb(var(--card))] border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <p className="text-xs uppercase text-slate-500 mb-1">Total users</p>
        <p className="text-2xl font-semibold">{stats.total}</p>
        <p className="text-xs text-slate-500 mt-1">
          Loaded from CSV and extended in memory.
        </p>
      </div>
      <div className="rounded-2xl bg-[rgb(var(--card))] border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <p className="text-xs uppercase text-slate-500 mb-1">
          Distinct IP addresses
        </p>
        <p className="text-2xl font-semibold">{stats.uniqueIps}</p>
        <p className="text-xs text-slate-500 mt-1">
          Approximate unique devices.
        </p>
      </div>
      <div className="rounded-2xl bg-[rgb(var(--card))] border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <p className="text-xs uppercase text-slate-500 mb-1">
          Gender categories
        </p>
        <p className="text-2xl font-semibold">
          {Object.keys(stats.byGender).length}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Breakdown visualized in the chart.
        </p>
      </div>
    </div>
  );
}
