import { useState } from 'react';
import type { TaskBrief, Stage, MemberDetail } from '../../types/it.types';
import { STAGE_MAP, VALID_TRANSITIONS } from '../../constants/it.constants';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  stage: Stage;
  tasks: TaskBrief[];
  members: MemberDetail[];
  onDrop: (taskId: string, fromStage: Stage, toStage: Stage) => void;
  onAssign: (taskId: string, memberId: string) => void;
  onAvatarClick: (memberId: string) => void;
}

export function KanbanColumn({ stage, tasks, members, onDrop, onAssign, onAvatarClick }: KanbanColumnProps) {
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const stageInfo = STAGE_MAP[stage];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const { taskId, fromStage } = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (fromStage === stage) return;
      const validNext = VALID_TRANSITIONS[fromStage as Stage];
      if (!validNext.includes(stage)) return;
      onDrop(taskId, fromStage, stage);
    } catch { /* ignore */ }
  };

  const overdueCount = tasks.filter(t => t.is_overdue).length;

  return (
    <div
      className={`flex flex-col bg-gray-900/50 rounded-xl border transition-all min-h-[400px]
        ${dragOver ? 'border-indigo-500 bg-indigo-900/10' : 'border-gray-800'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="px-3 py-3 border-b border-gray-800 flex items-center gap-2">
        <span className={`text-sm font-semibold ${stageInfo.color}`}>{stageInfo.label}</span>
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${stageInfo.color} ${stageInfo.bg}`}>
          {tasks.length}
        </span>
        {overdueCount > 0 && (
          <span className="ml-auto text-xs text-red-400 font-medium">🔴 {overdueCount} trễ</span>
        )}
      </div>

      {/* Tasks */}
      <div
        className={`flex-1 p-2 space-y-2 overflow-y-auto transition-colors ${dragOver ? 'bg-indigo-900/5' : ''}`}
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        {dragOver && (
          <div className="border-2 border-dashed border-indigo-600/50 rounded-lg h-16 flex items-center justify-center">
            <span className="text-indigo-400 text-sm">Thả vào đây</span>
          </div>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            members={members}
            onStageChange={(taskId, from, to) => onDrop(taskId, from, to)}
            onAssign={onAssign}
            onAvatarClick={onAvatarClick}
            isDragging={draggingId === task.id}
          />
        ))}
        {tasks.length === 0 && !dragOver && (
          <p className="text-gray-700 text-xs text-center py-8">Không có task</p>
        )}
      </div>
    </div>
  );
}
