import type { MemberDetail } from '../../types/it.types';
import { Avatar } from '../shared/Avatar';
import { LoadBar } from '../shared/LoadBar';
import { WORKLOAD_STATUS_MAP, MAX_TASKS } from '../../constants/it.constants';
import { highlightText } from './MemberSearch';

interface MemberCardProps {
  member: MemberDetail;
  query?: string;
  onClick: () => void;
}

export function MemberCard({ member, query = '', onClick }: MemberCardProps) {
  const cap = MAX_TASKS[member.member_type];
  const statusInfo = WORKLOAD_STATUS_MAP[member.workload_status];
  const pct = cap > 0 ? Math.round((member.active_tasks_count / cap) * 100) : 0;
  const canTake = cap - member.active_tasks_count;

  const borderColor = member.workload_status === 'burnout' ? 'border-red-900/60 hover:border-red-800'
    : member.workload_status === 'warn' ? 'border-yellow-900/40 hover:border-yellow-800'
    : 'border-gray-800 hover:border-gray-700';

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left bg-gray-900 border rounded-xl p-4 transition-all hover:shadow-lg ${borderColor}`}
    >
      {/* Burnout left border */}
      {member.workload_status === 'burnout' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-red-500" />
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          name={member.full_name}
          status={member.workload_status}
          size={36}
          avatarUrl={member.avatar_url}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-100 truncate">
            {highlightText(member.full_name, query)}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
              {member.member_type === 'exp' ? 'Experienced' : 'Vibe Coder'}
            </span>
            <span className={`text-[10px] font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Load bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Workload</span>
          <span className={pct > 90 ? 'text-red-400' : pct > 70 ? 'text-yellow-400' : 'text-gray-400'}>
            {member.active_tasks_count}/{cap} task
          </span>
        </div>
        <LoadBar value={member.active_tasks_count} max={cap} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-1 text-center">
        <div>
          <p className={`text-sm font-bold ${member.metrics.overdue_count > 0 ? 'text-red-400' : 'text-gray-300'}`}>
            {member.metrics.overdue_count}
          </p>
          <p className="text-[10px] text-gray-600">trễ</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-300">{member.metrics.revision_count}</p>
          <p className="text-[10px] text-gray-600">sửa</p>
        </div>
        <div>
          <p className={`text-sm font-bold ${member.metrics.idle_days > 2 ? 'text-blue-400' : 'text-gray-300'}`}>
            {member.metrics.idle_days}d
          </p>
          <p className="text-[10px] text-gray-600">idle</p>
        </div>
      </div>

      {/* Hover quick actions */}
      <div className="absolute inset-0 rounded-xl flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-t from-gray-900/80">
        {member.workload_status === 'burnout' && (
          <div className="w-full text-center py-1 px-3 bg-red-700/80 rounded-lg text-xs text-white font-medium">
            📤 Chuyển task
          </div>
        )}
        {member.workload_status === 'idle' && (
          <div className="w-full text-center py-1 px-3 bg-indigo-700/80 rounded-lg text-xs text-white font-medium">
            🎯 Giao task · Còn {canTake} slot
          </div>
        )}
        {(member.workload_status === 'ok' || member.workload_status === 'warn') && canTake > 0 && (
          <div className="w-full text-center py-1 px-3 bg-gray-700/80 rounded-lg text-xs text-gray-300">
            Có thể nhận thêm {canTake} task
          </div>
        )}
      </div>
    </button>
  );
}
