import type { TeamHealthSummary } from '../../types/it.types';

interface HealthCardsProps {
  summary: TeamHealthSummary;
}

export function HealthCards({ summary }: HealthCardsProps) {
  const cards = [
    { icon: '🔥', label: 'Burnout', count: summary.burnout_count, color: 'text-red-300', border: 'border-red-900/60', bg: 'bg-red-950/20' },
    { icon: '⚠️', label: 'Warn',    count: summary.warn_count,    color: 'text-yellow-300', border: 'border-yellow-900/60', bg: 'bg-yellow-950/20' },
    { icon: '😴', label: 'Idle',    count: summary.idle_count,    color: 'text-blue-300',  border: 'border-blue-900/60',  bg: 'bg-blue-950/20' },
    { icon: '✅', label: 'OK',      count: summary.ok_count,      color: 'text-green-300', border: 'border-green-900/60', bg: 'bg-green-950/20' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {cards.map(({ icon, label, count, color, border, bg }) => (
        <div key={label} className={`rounded-xl border p-4 ${border} ${bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{icon}</span>
            <span className={`text-sm font-medium ${color}`}>{label}</span>
          </div>
          <p className={`text-3xl font-bold ${color}`}>{count}</p>
          <p className="text-xs text-gray-500 mt-0.5">thành viên</p>
        </div>
      ))}
    </div>
  );
}
