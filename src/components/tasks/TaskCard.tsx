import { useState } from 'react';
import type { TaskBrief, MemberDetail, Stage } from '../../types/it.types';
import { PriorityBadge } from '../shared/PriorityBadge';
import { StageBadge } from '../shared/StageBadge';
import { Avatar } from '../shared/Avatar';
import { AssignDropdown } from './AssignDropdown';
import { ReviewHistory } from './ReviewHistory';
import { VALID_TRANSITIONS } from '../../constants/it.constants';

interface TaskCardProps {
  task: TaskBrief;
  members: MemberDetail[];
  onStageChange: (taskId: string, fromStage: Stage, toStage: Stage) => void;
  onAssign: (taskId: string, memberId: string) => void;
  onAvatarClick: (memberId: string) => void;
  isDragging?: boolean;
}

export function TaskCard({ task, members, onStageChange, onAssign, onAvatarClick, isDragging }: TaskCardProps) {
  const [showAssign, setShowAssign] = useState(false);

  const isOverdue = task.is_overdue;
  const canDrop = VALID_TRANSITIONS[task.stage];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, fromStage: task.stage }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-gray-850 border rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all select-none
        ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}
        ${isOverdue ? 'border-red-900/60' : 'border-gray-800'}
        hover:border-gray-700 hover:shadow-lg`}
      style={{ background: '#141720' }}
    >
      {/* Row 1: badges */}
      <div className="flex items-center gap-1.5 mb-2">
        <PriorityBadge priority={task.priority_id} />
        <StageBadge stage={task.stage} />
        {task.revision_count >= 1 && (
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 bg-orange-900/40 text-orange-400 rounded border border-orange-800/50">
            rv{task.revision_count}
          </span>
        )}
      </div>

      {/* Row 2: title */}
      <p className="text-sm text-gray-100 font-medium leading-snug line-clamp-2 mb-2">{task.title}</p>

      {/* Row 3: meta */}
      <div className="flex items-center gap-2 text-xs mb-2">
        <span className={isOverdue ? 'text-red-400 font-medium' : 'text-gray-500'}>
          {isOverdue ? '🔴 ' : ''}{formatDate(task.due_date)}
        </span>
        <span className="text-gray-700">·</span>
        <span className="text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded text-[10px]">{task.requesting_team}</span>
        <span className="ml-auto font-mono text-gray-600">{task.id}</span>
      </div>

      {/* Row 4: assignee + actions */}
      <div className="flex items-center justify-between relative">
        {task.assignee ? (
          <button
            onClick={() => onAvatarClick(task.assignee!.id)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <Avatar
              name={task.assignee.full_name}
              status={task.assignee.workload_status}
              size={22}
              tooltip={`${task.assignee.full_name} — ${task.assignee.active_tasks_count} task`}
            />
            <span className="text-xs text-gray-400 max-w-[100px] truncate">{task.assignee.full_name}</span>
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowAssign(s => !s); }}
              className="text-xs text-indigo-400 hover:text-indigo-300 border border-dashed border-indigo-800 rounded px-2 py-0.5 transition-colors"
            >
              + Assign
            </button>
            {showAssign && (
              <AssignDropdown
                members={members}
                onAssign={(memberId) => onAssign(task.id, memberId)}
                onClose={() => setShowAssign(false)}
              />
            )}
          </div>
        )}

        {task.revision_count >= 2 && (
          <ReviewHistory taskId={task.id} revisionCount={task.revision_count} />
        )}
      </div>
    </div>
  );
}
