import { STAGE_MAP } from '../../constants/it.constants';
import type { Stage } from '../../types/it.types';

export function StageBadge({ stage }: { stage: Stage }) {
  const { label, color, bg } = STAGE_MAP[stage];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${color} ${bg}`}>
      {label}
    </span>
  );
}
