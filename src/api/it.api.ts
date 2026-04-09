import type {
  DashboardSummary, ActionItem, TaskBrief, TaskDetail,
  StageEvent, MemberDetail, TeamHealthSummary,
  Stage, Priority, RequestingTeam, ApiError,
} from '../types/it.types';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://api.nquoc.vn';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw err;
  }
  return res.json() as Promise<T>;
}

// --- DASHBOARD ---
export const getDashboardSummary = () =>
  apiFetch<{ data: DashboardSummary }>('/api/v1/it/dashboard/summary');

export const getDashboardActions = (type?: ActionItem['type']) =>
  apiFetch<{ data: ActionItem[] }>(`/api/v1/it/dashboard/actions${type ? `?type=${type}` : ''}`);

// --- TASKS ---
export interface TasksFilter {
  priority_id?: Priority;
  assignee_id?: string;
  unassigned_only?: boolean;
}

export const getTasks = (filter: TasksFilter = {}) => {
  const params = new URLSearchParams();
  if (filter.priority_id) params.set('priority_id', filter.priority_id);
  if (filter.assignee_id) params.set('assignee_id', filter.assignee_id);
  if (filter.unassigned_only) params.set('unassigned_only', 'true');
  const q = params.toString();
  return apiFetch<{ data: Record<string, TaskBrief[]>; total_active: number }>(
    `/api/v1/it/tasks${q ? `?${q}` : ''}`
  );
};

export const getTask = (id: string) =>
  apiFetch<{ data: TaskDetail }>(`/api/v1/it/tasks/${id}`);

export const createTask = (body: {
  title: string; description?: string;
  priority_id: Priority; due_date: string; requesting_team: RequestingTeam;
}) => apiFetch<{ data: TaskDetail }>('/api/v1/it/tasks', { method: 'POST', body: JSON.stringify(body) });

export const patchTask = (id: string, body: Partial<TaskBrief>) =>
  apiFetch<{ data: TaskDetail }>(`/api/v1/it/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const changeTaskStage = (id: string, to_stage: Stage, note?: string) =>
  apiFetch<{ data: TaskDetail; event: StageEvent }>(
    `/api/v1/it/tasks/${id}/stage`,
    { method: 'POST', body: JSON.stringify({ to_stage, note }) }
  );

export const assignTask = (id: string, member_id: string) =>
  apiFetch<{ data: TaskDetail; workload_warning?: string }>(
    `/api/v1/it/tasks/${id}/assign`,
    { method: 'POST', body: JSON.stringify({ member_id }) }
  );

export const transferTask = (id: string, to_member_id: string, reason?: string) =>
  apiFetch<{ data: TaskDetail }>(
    `/api/v1/it/tasks/${id}/transfer`,
    { method: 'POST', body: JSON.stringify({ to_member_id, reason }) }
  );

export const getTaskHistory = (id: string) =>
  apiFetch<{ data: StageEvent[] }>(`/api/v1/it/tasks/${id}/history`);

// --- MEMBERS ---
export const getMembers = (workload_status?: string) =>
  apiFetch<{ data: MemberDetail[]; summary: { total: number; exp_count: number; vibe_count: number } }>(
    `/api/v1/it/members${workload_status ? `?workload_status=${workload_status}` : ''}`
  );

export const getMember = (id: string) =>
  apiFetch<{ data: MemberDetail }>(`/api/v1/it/members/${id}`);

// --- HEALTH ---
export const getTeamHealth = () =>
  apiFetch<{ data: TeamHealthSummary }>('/api/v1/it/health/team');
