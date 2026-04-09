import { useState } from 'react';
import type { StatCard as StatCardType } from '../../types/it.types';

function Sparkline({ data }: { data: { date: string; value: number }[] }) {
  if (!data.length) return null;
  const vals = data.map(d => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 60, H = 20, pad = 2;
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {vals.map((v, i) => {
        const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
        const y = H - pad - ((v - min) / range) * (H - pad * 2);
        return i === vals.length - 1 ? <circle key={i} cx={x} cy={y} r={2.5} fill="#6366f1" /> : null;
      })}
    </svg>
  );
}

interface StatCardProps { card: StatCardType; }

export function StatCard({ card }: StatCardProps) {
  const [hovered, setHovered] = useState(false);
  const { label, value, unit, delta, weekly_history } = card;

  const deltaColor = delta
    ? (delta.is_positive_trend ? 'text-green-400' : 'text-red-400')
    : 'text-gray-500';
  const deltaIcon = delta ? (delta.is_positive_trend ? '↑' : '↓') : '';
  const deltaText = delta ? `${deltaIcon} ${delta.value > 0 ? '+' : ''}${delta.value} so với tuần trước` : '---';

  return (
    <div
      className="relative bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold text-white">{value}</span>
        {unit && <span className="text-gray-500 text-sm mb-0.5">{unit}</span>}
      </div>
      <p className={`text-xs mt-1 ${deltaColor}`}>{deltaText}</p>

      {/* Sparkline tooltip */}
      {hovered && weekly_history && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-xl z-10 pointer-events-none">
          <p className="text-[10px] text-gray-400 mb-1">7 ngày qua</p>
          <Sparkline data={weekly_history} />
        </div>
      )}
    </div>
  );
}
