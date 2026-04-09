import { useState } from 'react';
import { useTeamHealth } from '../hooks/useTeamHealth';
import { HealthCards } from '../components/health/HealthCards';
import { AIPanel } from '../components/health/AIPanel';
import { ExportButton } from '../components/health/ExportButton';
import { HealthTable } from '../components/health/HealthTable';
import { MemberModal } from '../components/members/MemberModal';
import { PageHeader } from '../components/layout/PageHeader';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';
import { ToastContainer, useToast } from '../components/shared/Toast';
import { transferTask } from '../api/it.api';
import type { MemberDetail } from '../types/it.types';

export function HealthPage() {
  const { health, loading, error, reload } = useTeamHealth();
  const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null);
  const { toasts, addToast, dismiss } = useToast();

  const handleTransfer = async (taskId: string, toMemberId: string) => {
    try {
      await transferTask(taskId, toMemberId);
      const toMember = health?.members.find(m => m.id === toMemberId);
      addToast(`Đã chuyển task sang ${toMember?.full_name ?? 'thành viên'}`);
      reload();
    } catch {
      addToast('Lỗi chuyển task');
    }
  };

  if (loading) return <div className="p-8"><SkeletonLoader lines={8} /></div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;
  if (!health) return null;

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Sức khỏe Team"
        subtitle={`Cập nhật ${new Date(health.generated_at).toLocaleString('vi-VN')}`}
        actions={<ExportButton health={health} onToast={addToast} />}
      />

      <HealthCards summary={health} />
      <AIPanel health={health} />
      <HealthTable members={health.members} onSelectMember={setSelectedMember} />

      {selectedMember && (
        <MemberModal
          member={selectedMember}
          allMembers={health.members}
          onClose={() => setSelectedMember(null)}
          onTransfer={handleTransfer}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
