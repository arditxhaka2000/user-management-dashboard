import { useMemo } from 'react';
import { useUserStore } from '../../store/userStore';
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#2563eb', '#f97316', '#22c55e', '#e11d48', '#a855f7'];

export function DemographicsChart() {
  const { users } = useUserStore();

  const data = useMemo(() => {
    const counts = users.reduce<Record<string, number>>((acc, user) => {
      const key = user.gender || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[rgb(var(--card))] border border-slate-200 dark:border-slate-700 p-4 shadow-sm mt-4">
      <h2 className="text-sm font-semibold mb-2">Gender distribution</h2>
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
