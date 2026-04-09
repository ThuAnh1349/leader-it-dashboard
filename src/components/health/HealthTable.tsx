import { useState } from 'react';
import type { MemberDetail, HealthFilter, HealthSort } from '../../types/it.types';
import { Avatar } from '../shared/Avatar';
import { WORKLOAD_STATUS_MAP } from '../../constants/it.constants';

interface HealthTableProps {
  members: MemberDetail[];
  onSelectMember: (m: MemberDetail) => void;
}

const FILTERS: { key: HealthFilter; label: string; icon: string }[] = [
  { key: 'all',     label: 'Tất cả', icon: '' },
  { key: 'burnout', label: 'Burnout', icon: '🔥' },
  { key: 'warn',    label: 'Warn',    icon: '⚠️' },
  { key: 'idle',    label: 'Idle',    icon: '😴' },
  { key: 'ok',      label: 'OK',      icon: '✅' },
];

type ColKey = 'name' | 'tasks' | 'overdue' | 'revision' | 'feedback' | 'status';

const COLS: { key: ColKey; label: string }[] = [
  { key: 'name',     label: 'Tên' },
  { key: 'tasks',    label: 'Task' },
  { key: 'overdue',  label: 'Trễ' },
  { key: 'revision', label: 'Review' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'status',   label: 'Status' },
];

export function HealthTable({ members, onSelectMember }: HealthTableProps) {
  const [filter, setFilter] = useState<HealthFilter>('all');
  const [sort, setSort] = useState<HealthSort>({ col: 'tasks', dir: 'desc' });

  const handleSort = (col: string) => {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' });
  };

  const filtered = members.filter(m => filter === 'all' || m.workload_status === filter);

  const sorted = [...filtered].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    switch (sort.col) {
      case 'name':     return a.full_name.localeCompare(b.full_name) * dir;
      case 'tasks':    return (a.active_tasks_count - b.active_tasks_count) * dir;
      case 'overdue':  return (a.metrics.overdue_count - b.metrics.overdue_count) * dir;
      case 'revision': return (a.metrics.revision_count - b.metrics.revision_count) * dir;
      case 'feedback': return (a.metrics.feedback_issues - b.metrics.feedback_issues) * dir;
      case 'status': {
        const order: Record<string, number> = { burnout: 0, warn: 1, ok: 2, idle: 3 };
        return ((order[a.workload_status] ?? 99) - (order[b.workload_status] ?? 99)) * dir;
      }
      default: return 0;
    }
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Filter chips */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === f.key
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-700'
                : 'text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            {f.icon} {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-600">{sorted.length} thành viên</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {COLS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-2.5 text-left text-xs text-gray-500 font-medium uppercase tracking-wide cursor-pointer hover:text-gray-300 transition-colors"
                >
                  {col.label}
                  {sort.col === col.key && <span className="ml-1">{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(m => {
              const statusInfo = WORKLOAD_STATUS_MAP[m.workload_status];
              const isBurnout = m.workload_status === 'burnout';
              return (
                <tr
                  key={m.id}
                  onClick={() => onSelectMember(m)}
                  className={`border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors
                    ${isBurnout ? 'border-l-2 border-l-red-600' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={m.full_name} status={m.workload_status} size={24} />
                      <span className="text-sm text-gray-200">{m.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{m.active_tasks_count}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${m.metrics.overdue_count > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {m.metrics.overdue_count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{m.metrics.revision_count}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${m.metrics.feedback_issues > 0 ? 'text-orange-400' : 'text-gray-400'}`}>
                      {m.metrics.feedback_issues}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo.color} ${
                      isBurnout ? 'bg-red-900/30' : 'bg-gray-800'
                    }`}>
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
