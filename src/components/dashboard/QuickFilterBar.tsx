import type { ActionCounts, QuickFilter } from '../../types/it.types';

interface QuickFilterBarProps {
  counts: ActionCounts;
  active: QuickFilter;
  onChange: (f: QuickFilter) => void;
}

interface PillCfg {
  key: QuickFilter;
  icon: string;
  label: string;
  count: number;
  activeClass: string;
}

export function QuickFilterBar({ counts, active, onChange }: QuickFilterBarProps) {
  const pills: PillCfg[] = [
    { key: 'overdue',       icon: '🔴', label: 'Trễ hôm nay',    count: counts.overdue,       activeClass: 'bg-red-900/40 border-red-600 text-red-300' },
    { key: 'p0_unassigned', icon: '⚡', label: 'P0 chưa nhận',   count: counts.p0_unassigned, activeClass: 'bg-amber-900/40 border-amber-600 text-amber-300' },
    { key: 'burnout',       icon: '🔥', label: 'Burnout',         count: counts.burnout_risk,  activeClass: 'bg-orange-900/40 border-orange-600 text-orange-300' },
  ];

  return (
    <div className="flex gap-2 mb-5">
      {pills.map(pill => {
        const isActive = active === pill.key;
        const isEmpty = pill.count === 0;
        return (
          <button
            key={pill.key}
            onClick={() => onChange(isActive ? 'all' : pill.key)}
            disabled={isEmpty}
            title={isEmpty ? 'Không có vấn đề' : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all
              ${isEmpty ? 'border-gray-800 text-gray-600 cursor-not-allowed'
                : isActive ? pill.activeClass
                : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
          >
            <span>{pill.icon}</span>
            <span>{pill.label}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isEmpty ? 'bg-gray-800 text-gray-600' : isActive ? 'bg-white/10' : 'bg-gray-800 text-gray-300'}`}>
              {pill.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
