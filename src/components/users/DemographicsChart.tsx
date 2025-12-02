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

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export function DemographicsChart() {
  const { users } = useUserStore();

  const data = useMemo(() => {
    const counts = users.reduce<Record<string, number>>((acc, user) => {
      const key = user.gender || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [users]);

  if (data.length === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / users.length) * 100).toFixed(1);
      return (
        <div className="bg-[rgb(var(--card))] border-2 border-[rgb(var(--card-border))] rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm">
          <p className="font-semibold text-sm mb-1">{payload[0].name}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Count: <span className="font-bold text-[rgb(var(--accent))]">{payload[0].value}</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Percentage: <span className="font-bold text-[rgb(var(--accent))]">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[rgb(var(--card))] border-2 border-[rgb(var(--card-border))] p-6 shadow-lg mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Gender Distribution</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Demographics breakdown of all users
          </p>
        </div>
        
        {/* Legend badges */}
        <div className="hidden lg:flex items-center gap-2">
          {data.map((entry, index) => (
            <div
              key={entry.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs font-medium">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={3}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgb(var(--card))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-6 border-t-2 border-[rgb(var(--card-border))] grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((entry, index) => {
          const percentage = ((entry.value / users.length) * 100).toFixed(1);
          return (
            <div key={entry.name} className="text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold shadow-lg"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              >
                {entry.value}
              </div>
              <p className="text-xs font-semibold mb-1">{entry.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}