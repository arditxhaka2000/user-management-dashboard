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

  const statCards = [
    {
      label: 'Total Users',
      value: stats.total,
      description: 'Loaded from CSV and extended in memory',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Unique IPs',
      value: stats.uniqueIps,
      description: 'Approximate unique devices',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Gender Categories',
      value: Object.keys(stats.byGender).length,
      description: 'Breakdown visualized in chart',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 stagger-children">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className="group relative rounded-2xl bg-[rgb(var(--card))] border-2 border-[rgb(var(--card-border))] p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                <div className="text-white">
                  {card.icon}
                </div>
              </div>
              
              {/* Decorative element */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-300`} />
            </div>

            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">
              {card.label}
            </p>
            
            <p className="text-4xl font-bold mb-2 bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              {card.value.toLocaleString()}
            </p>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {card.description}
            </p>
          </div>

          {/* Bottom gradient bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
        </div>
      ))}
    </div>
  );
}