import { useState, useMemo } from 'react';
import { useMembers } from '../hooks/useMembers';
import { MemberGrid } from '../components/members/MemberGrid';
import { MemberSearch } from '../components/members/MemberSearch';
import { MemberSortDropdown } from '../components/members/MemberSortDropdown';
import { MemberModal } from '../components/members/MemberModal';
import { PageHeader } from '../components/layout/PageHeader';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';
import { ToastContainer, useToast } from '../components/shared/Toast';
import { transferTask } from '../api/it.api';
import type { MemberDetail, SortMode } from '../types/it.types';
import { WORKLOAD_STATUS_MAP } from '../constants/it.constants';

function useDebounce<T>(val: T, ms = 150): T {
  const [debouncedVal, setDebouncedVal] = useState(val);
  useState(() => {
    const t = setTimeout(() => setDebouncedVal(val), ms);
    return () => clearTimeout(t);
  });
  return debouncedVal;
}

export function MembersPage() {
  const { members, summary, loading, error, reload } = useMembers();
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('urgency');
  const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null);
  const { toasts, addToast, dismiss } = useToast();

  const debouncedQuery = useDebounce(query, 150);

  const displayMembers = useMemo(() => {
    let result = members;

    // Filter by query
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(m => m.full_name.toLowerCase().includes(q));
    }

    // Sort
    return [...result].sort((a, b) => {
      switch (sortMode) {
        case 'urgency': {
          const order: Record<string, number> = { burnout: 0, warn: 1, ok: 2, idle: 3 };
          return (order[a.workload_status] ?? 99) - (order[b.workload_status] ?? 99);
        }
        case 'workload_desc': return b.active_tasks_count - a.active_tasks_count;
        case 'workload_asc':  return a.active_tasks_count - b.active_tasks_count;
        case 'idle_first':    return b.metrics.idle_days - a.metrics.idle_days;
        case 'az':            return a.full_name.localeCompare(b.full_name);
        default: return 0;
      }
    });
  }, [members, debouncedQuery, sortMode]);

  const handleTransfer = async (taskId: string, toMemberId: string) => {
    try {
      await transferTask(taskId, toMemberId);
      const toMember = members.find(m => m.id === toMemberId);
      addToast(`Đã chuyển task sang ${toMember?.full_name ?? 'thành viên'}`, {
        undoLabel: 'Hoàn tác',
        onUndo: async () => {
          if (selectedMember) await transferTask(taskId, selectedMember.id);
        },
      });
      reload();
    } catch {
      addToast('Lỗi chuyển task');
    }
  };

  if (loading) return <div className="p-8"><SkeletonLoader lines={8} /></div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-8">
      <PageHeader
        title="Thành viên"
        subtitle={`${summary.total} thành viên · ${summary.exp_count} Experienced · ${summary.vibe_count} Vibe Coder`}
      />

      {/* Controls */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <MemberSearch value={query} onChange={setQuery} />
        <MemberSortDropdown value={sortMode} onChange={setSortMode} />

        {/* Status summary pills */}
        <div className="ml-auto flex items-center gap-1.5 flex-wrap">
          {(['burnout', 'warn', 'idle', 'ok'] as const).map(status => {
            const count = members.filter(m => m.workload_status === status).length;
            if (count === 0) return null;
            return (
              <span key={status} className={`text-xs px-2 py-1 rounded-full bg-gray-800 ${WORKLOAD_STATUS_MAP[status].color}`}>
                {WORKLOAD_STATUS_MAP[status].label}: {count}
              </span>
            );
          })}
        </div>
      </div>

      <MemberGrid members={displayMembers} query={debouncedQuery} onSelect={setSelectedMember} />

      {selectedMember && (
        <MemberModal
          member={selectedMember}
          allMembers={members}
          onClose={() => setSelectedMember(null)}
          onTransfer={handleTransfer}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
