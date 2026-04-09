import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useMembers } from '../hooks/useMembers';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { MemberFilterChip } from '../components/tasks/MemberFilterChip';
import { PageHeader } from '../components/layout/PageHeader';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';
import { ToastContainer, useToast } from '../components/shared/Toast';
import type { Priority, Stage } from '../types/it.types';
import { PRIORITY_MAP } from '../constants/it.constants';

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: 'p0', label: 'P0 Khẩn' },
  { id: 'p1', label: 'P1 Cao' },
  { id: 'p2', label: 'P2' },
  { id: 'p3', label: 'P3' },
];

export function TasksPage() {
  const [searchParams] = useSearchParams();
  const [priorityFilter, setPriorityFilter] = useState<Priority | undefined>();
  const [memberFilter, setMemberFilter] = useState<string | undefined>();

  const { data, loading, error, moveTask, assignTask, transferTask } = useTasks({
    priority_id: priorityFilter,
    assignee_id: memberFilter,
  });
  const { members } = useMembers();
  const { toasts, addToast, dismiss } = useToast();

  const filteredMember = members.find(m => m.id === memberFilter);

  const handleDrop = async (taskId: string, fromStage: Stage, toStage: Stage) => {
    const result = await moveTask(taskId, fromStage, toStage);
    if (result.ok) {
      addToast(`Đã chuyển task → ${toStage}`, {
        undoLabel: 'Hoàn tác',
        onUndo: () => moveTask(taskId, toStage, fromStage),
      });
    } else {
      addToast(`Lỗi: ${result.error}`);
    }
  };

  const handleAssign = async (taskId: string, memberId: string) => {
    try {
      const res = await assignTask(taskId, memberId);
      const name = res.data.assignee?.full_name ?? 'thành viên';
      addToast(`Đã giao task cho ${name}`);
      if (res.workload_warning) addToast(`⚠️ ${res.workload_warning}`);
    } catch (e: unknown) {
      addToast(`Lỗi giao task: ${(e as { message?: string }).message ?? ''}`);
    }
  };

  if (loading) return <div className="p-8"><SkeletonLoader lines={8} /></div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  const totalActive = Object.values(data).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="p-8">
      <PageHeader
        title="Tasks"
        subtitle={`${totalActive} task đang chạy`}
      />

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setPriorityFilter(undefined)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
            !priorityFilter ? 'bg-indigo-600/20 border-indigo-600 text-indigo-300' : 'border-gray-700 text-gray-400 hover:border-gray-600'
          }`}
        >
          Tất cả
        </button>
        {PRIORITIES.map(p => {
          const info = PRIORITY_MAP[p.id];
          return (
            <button
              key={p.id}
              onClick={() => setPriorityFilter(priorityFilter === p.id ? undefined : p.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                priorityFilter === p.id ? `${info.color} ${info.bg} ${info.border}` : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {p.label}
            </button>
          );
        })}

        {filteredMember && (
          <MemberFilterChip
            name={filteredMember.full_name}
            onRemove={() => setMemberFilter(undefined)}
          />
        )}
      </div>

      <KanbanBoard
        data={data}
        members={members}
        onDrop={handleDrop}
        onAssign={handleAssign}
        onAvatarClick={(id) => setMemberFilter(memberFilter === id ? undefined : id)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
