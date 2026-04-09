import { useEffect, useRef, useState } from 'react';
import type { MemberDetail, MemberBrief } from '../../types/it.types';
import { Avatar } from '../shared/Avatar';
import { PriorityBadge } from '../shared/PriorityBadge';
import { StageBadge } from '../shared/StageBadge';
import { LoadBar } from '../shared/LoadBar';
import { WORKLOAD_STATUS_MAP, MAX_TASKS } from '../../constants/it.constants';

interface MemberModalProps {
  member: MemberDetail;
  allMembers: MemberDetail[];
  onClose: () => void;
  onTransfer: (taskId: string, toMemberId: string) => Promise<void>;
}

export function MemberModal({ member, allMembers, onClose, onTransfer }: MemberModalProps) {
  const [transferTarget, setTransferTarget] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const statusInfo = WORKLOAD_STATUS_MAP[member.workload_status];
  const cap = MAX_TASKS[member.member_type];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const availableMembers = allMembers.filter(m => m.id !== member.id && m.workload_status !== 'burnout');

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-800 flex items-start gap-4">
          <Avatar name={member.full_name} status={member.workload_status} size={48} avatarUrl={member.avatar_url} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{member.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                {member.member_type === 'exp' ? 'Experienced' : 'Vibe Coder'}
              </span>
              <span className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            <div className="mt-2">
              <LoadBar value={member.active_tasks_count} max={cap} className="w-32" />
              <span className="text-xs text-gray-500 mt-0.5 block">{member.active_tasks_count}/{cap} task active</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">×</button>
        </div>

        {/* Metrics */}
        <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-4 gap-3 text-center">
          {[
            { label: 'Overdue', val: member.metrics.overdue_count, color: member.metrics.overdue_count > 0 ? 'text-red-400' : 'text-gray-300' },
            { label: 'Sửa', val: member.metrics.revision_count, color: 'text-gray-300' },
            { label: 'Feedback', val: member.metrics.feedback_issues, color: member.metrics.feedback_issues > 0 ? 'text-orange-400' : 'text-gray-300' },
            { label: 'Idle', val: `${member.metrics.idle_days}d`, color: 'text-gray-300' },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <p className={`text-lg font-bold ${color}`}>{val}</p>
              <p className="text-[10px] text-gray-600">{label}</p>
            </div>
          ))}
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Task đang xử lý</p>
          {member.active_tasks.length === 0 ? (
            <p className="text-gray-600 text-sm italic py-4 text-center">Không có task active</p>
          ) : (
            <div className="space-y-2">
              {member.active_tasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 p-2.5 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <PriorityBadge priority={task.priority_id} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StageBadge stage={task.stage} />
                      <span className="text-[10px] text-gray-600 font-mono">{task.id}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setTransferTarget(t => t === task.id ? null : task.id)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 whitespace-nowrap px-2 py-1 border border-indigo-800 rounded-lg hover:border-indigo-600"
                    >
                      → Chuyển
                    </button>
                    {transferTarget === task.id && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-10 overflow-hidden">
                        {availableMembers.length === 0 ? (
                          <p className="px-3 py-2 text-sm text-gray-500">Không có thành viên available</p>
                        ) : (
                          availableMembers.map(m => (
                            <button
                              key={m.id}
                              onClick={async () => {
                                await onTransfer(task.id, m.id);
                                setTransferTarget(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-sm text-gray-200"
                            >
                              <Avatar name={m.full_name} status={m.workload_status} size={20} />
                              <span className="truncate">{m.full_name}</span>
                              <span className="text-xs text-gray-500 ml-auto">{m.active_tasks_count}/{MAX_TASKS[m.member_type]}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
