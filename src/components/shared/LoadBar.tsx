interface LoadBarProps {
  value: number;
  max: number;
  className?: string;
}

export function LoadBar({ value, max, className = '' }: LoadBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const color = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-400' : 'bg-green-400';

  return (
    <div className={`h-1.5 rounded-full bg-gray-700 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
