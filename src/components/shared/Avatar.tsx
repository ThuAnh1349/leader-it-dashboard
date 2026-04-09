import type { WorkloadStatus } from '../../types/it.types';

const COLORS = [
  'bg-indigo-600', 'bg-violet-600', 'bg-cyan-600', 'bg-emerald-600',
  'bg-rose-600', 'bg-amber-600', 'bg-teal-600', 'bg-sky-600',
  'bg-pink-600', 'bg-lime-600',
];

function hashColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return COLORS[h % COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const DOT: Record<WorkloadStatus, string> = {
  idle:    'bg-blue-400',
  ok:      'bg-green-400',
  warn:    'bg-yellow-400',
  burnout: 'bg-red-500 animate-pulse',
};

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  status?: WorkloadStatus;
  size?: number;
  showDot?: boolean;
  tooltip?: string;
  onClick?: () => void;
}

export function Avatar({ name, avatarUrl, status, size = 22, showDot = true, tooltip, onClick }: AvatarProps) {
  const bg = hashColor(name);
  const sz = `w-[${size}px] h-[${size}px]`;
  const textSz = size <= 24 ? 'text-[9px]' : size <= 32 ? 'text-xs' : 'text-sm';

  return (
    <div
      className="relative inline-flex shrink-0 cursor-pointer"
      title={tooltip ?? name}
      onClick={onClick}
    >
      <div
        className={`${bg} rounded-full flex items-center justify-center text-white font-semibold select-none overflow-hidden`}
        style={{ width: size, height: size }}
      >
        {avatarUrl
          ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded-full" />
          : <span className={textSz}>{initials(name)}</span>
        }
      </div>
      {showDot && status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border border-gray-900 ${DOT[status]}`}
          style={{ width: Math.max(6, size * 0.28), height: Math.max(6, size * 0.28) }}
        />
      )}
    </div>
  );
}
