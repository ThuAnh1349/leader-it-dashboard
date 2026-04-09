import { useEffect, useRef } from 'react';
import type { MemberDetail } from '../../types/it.types';
import { Avatar } from '../shared/Avatar';
import { WORKLOAD_STATUS_MAP, MAX_TASKS } from '../../constants/it.constants';

interface AssignDropdownProps {
  members: MemberDetail[];
  onAssign: (memberId: string) => void;
  onClose: () => void;
}

export function AssignDropdown({ members, onAssign, onClose }: AssignDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  const sorted = [...members].sort((a, b) => {
    const order: Record<string, number> = { idle: 0, ok: 1, warn: 2, burnout: 3 };
    return (order[a.workload_status] ?? 99) - (order[b.workload_status] ?? 99);
  });

  const available = sorted.filter(m => m.workload_status !== 'burnout');
  const overloaded = sorted.filter(m => m.workload_status === 'burnout');

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 w-64 bg-gray-850 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
      style={{ background: '#141720' }}
    >
      <div className="px-3 py-2 border-b border-gray-800">
        <p className="text-xs text-gray-400 font-medium">Giao cho</p>
      </div>
      <div className="max-h-56 overflow-y-auto">
        {available.length === 0 && overloaded.length === 0 && (
          <p className="px-4 py-3 text-sm text-gray-500">Tất cả đang overload — xem Health</p>
        )}
        {[...available, ...overloaded].map(m => {
          const cap = MAX_TASKS[m.member_type];
          const isBurnout = m.workload_status === 'burnout';
          const statusInfo = WORKLOAD_STATUS_MAP[m.workload_status];
          return (
            <button
              key={m.id}
              onClick={() => { onAssign(m.id); onClose(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-800 text-left transition-colors ${isBurnout ? 'opacity-75' : ''}`}
            >
              <Avatar name={m.full_name} status={m.workload_status} size={24} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-200 truncate">{m.full_name}</span>
                  {isBurnout && <span className="text-yellow-400 text-xs">⚠️</span>}
                </div>
                <span className={`text-xs ${isBurnout ? 'text-red-400' : 'text-gray-500'}`}>
                  {m.active_tasks_count}/{cap} task · {statusInfo.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
