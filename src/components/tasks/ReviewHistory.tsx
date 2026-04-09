import { useState } from 'react';
import type { StageEvent } from '../../types/it.types';
import { STAGE_MAP } from '../../constants/it.constants';

interface ReviewHistoryProps {
  taskId: string;
  revisionCount: number;
  events?: StageEvent[];
}

export function ReviewHistory({ taskId, revisionCount, events = [] }: ReviewHistoryProps) {
  const [open, setOpen] = useState(false);

  if (revisionCount < 2) return null;

  const reviewEvents = events.filter(e => e.from_stage === 'in_review' && e.to_stage === 'needs_fix');
  const displayEvents = reviewEvents.slice(0, open ? undefined : 3);
  const extra = reviewEvents.length - 3;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        title="Xem lịch sử review"
      >
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
        <span>{revisionCount} lần sửa</span>
      </button>

      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? '200px' : '0' }}
      >
        <div className="mt-2 space-y-1 border-l-2 border-orange-800/50 pl-3">
          {reviewEvents.length === 0 ? (
            <p className="text-xs text-gray-600">Chưa có lịch sử chi tiết</p>
          ) : (
            <>
              {displayEvents.map((ev, i) => (
                <div key={ev.id} className="text-xs text-gray-400">
                  <span className="text-orange-400 font-medium">Lần {i + 1}</span>
                  {' · '}
                  <span>{formatDate(ev.occurred_at)}</span>
                  {' · '}
                  <span>{ev.transitioned_by.full_name}</span>
                  {' → '}
                  <span className={STAGE_MAP['needs_fix'].color}>{STAGE_MAP['needs_fix'].label}</span>
                  {ev.note && <p className="text-gray-600 italic truncate">{ev.note}</p>}
                </div>
              ))}
              {!open && extra > 0 && (
                <button className="text-xs text-indigo-400 hover:text-indigo-300">Xem thêm ({extra})</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
