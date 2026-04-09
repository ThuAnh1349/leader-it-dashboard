import type { KanbanData } from '../../hooks/useTasks';
import type { Stage, MemberDetail } from '../../types/it.types';
import { STAGE_ORDER } from '../../constants/it.constants';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  data: KanbanData;
  members: MemberDetail[];
  onDrop: (taskId: string, fromStage: Stage, toStage: Stage) => void;
  onAssign: (taskId: string, memberId: string) => void;
  onAvatarClick: (memberId: string) => void;
}

export function KanbanBoard({ data, members, onDrop, onAssign, onAvatarClick }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {STAGE_ORDER.map(stage => (
        <KanbanColumn
          key={stage}
          stage={stage}
          tasks={data[stage as keyof KanbanData] ?? []}
          members={members}
          onDrop={onDrop}
          onAssign={onAssign}
          onAvatarClick={onAvatarClick}
        />
      ))}
    </div>
  );
}
