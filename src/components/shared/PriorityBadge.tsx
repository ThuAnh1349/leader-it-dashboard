import { PRIORITY_MAP } from '../../constants/it.constants';
import type { Priority } from '../../types/it.types';

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, color, bg, border } = PRIORITY_MAP[priority];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${color} ${bg} ${border}`}>
      {label}
    </span>
  );
}
