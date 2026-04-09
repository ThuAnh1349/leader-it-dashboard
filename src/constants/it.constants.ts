import type { Stage, Priority, RequestingTeam, WorkloadStatus, MemberType } from '../types/it.types';

export const STAGE_MAP: Record<Stage, { label: string; color: string; bg: string }> = {
  incoming:    { label: 'Chờ nhận',    color: 'text-blue-400',   bg: 'bg-blue-900/40' },
  in_progress: { label: 'Đang làm',   color: 'text-yellow-400', bg: 'bg-yellow-900/40' },
  in_review:   { label: 'Chờ review', color: 'text-purple-400', bg: 'bg-purple-900/40' },
  needs_fix:   { label: 'Cần sửa',    color: 'text-orange-400', bg: 'bg-orange-900/40' },
  done:        { label: 'Hoàn thành', color: 'text-green-400',  bg: 'bg-green-900/40' },
};

export const PRIORITY_MAP: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  p0: { label: 'P0 Khẩn', color: 'text-red-300',    bg: 'bg-red-900/50',    border: 'border-red-600' },
  p1: { label: 'P1 Cao',  color: 'text-orange-300', bg: 'bg-orange-900/50', border: 'border-orange-600' },
  p2: { label: 'P2',      color: 'text-yellow-300', bg: 'bg-yellow-900/50', border: 'border-yellow-600' },
  p3: { label: 'P3',      color: 'text-gray-400',   bg: 'bg-gray-800/50',   border: 'border-gray-600' },
};

export const REQUESTING_TEAMS: RequestingTeam[] = [
  'Admin', 'Finance', 'HR', 'MKT', 'Security', 'WH', 'CRM', 'Infra', 'All',
];

export const WORKLOAD_STATUS_MAP: Record<WorkloadStatus, { label: string; color: string; dotColor: string }> = {
  idle:    { label: 'Nhàn',     color: 'text-blue-400',  dotColor: 'bg-blue-400' },
  ok:      { label: 'Ổn',       color: 'text-green-400', dotColor: 'bg-green-400' },
  warn:    { label: 'Cẩn thận', color: 'text-yellow-400',dotColor: 'bg-yellow-400' },
  burnout: { label: 'Burnout',  color: 'text-red-400',   dotColor: 'bg-red-500' },
};

export const MAX_TASKS: Record<MemberType, number> = {
  exp:  5,
  vibe: 3,
};

export const VALID_TRANSITIONS: Record<Stage, Stage[]> = {
  incoming:    ['in_progress'],
  in_progress: ['in_review'],
  in_review:   ['needs_fix', 'done'],
  needs_fix:   ['in_progress'],
  done:        [],
};

export const STAGE_ORDER: Stage[] = ['incoming', 'in_progress', 'in_review', 'needs_fix'];
