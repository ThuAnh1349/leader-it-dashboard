// src/types/it.types.ts

// --- ENUMS ---

export type Stage = 'incoming' | 'in_progress' | 'in_review' | 'needs_fix' | 'done';
export type Priority = 'p0' | 'p1' | 'p2' | 'p3';
export type WorkloadStatus = 'idle' | 'ok' | 'warn' | 'burnout';
export type MemberType = 'exp' | 'vibe';
export type RequestingTeam = 'Admin' | 'Finance' | 'HR' | 'MKT' | 'Security' | 'WH' | 'CRM' | 'Infra' | 'All';
export type ActionItemType = 'overdue' | 'p0_unassigned' | 'burnout_risk';
export type Severity = 'critical' | 'high' | 'medium';
export type AlertScope = 'p0_only' | 'p0_p1' | 'all';
export type SuggestionStatus = 'pending' | 'applied' | 'skipped';
export type DispatchSessionStatus = 'active' | 'completed' | 'expired';

// --- MEMBER ---

export interface MemberBrief {
  id: string;
  full_name: string;
  avatar_url: string | null;
  member_type: MemberType;
  workload_status: WorkloadStatus;
  active_tasks_count: number;
}

export interface MemberWorkloadMetrics {
  active_tasks_count: number;
  overdue_count: number;
  revision_count: number;
  feedback_issues: number;
  idle_days: number;
  max_tasks_capacity: number;
}

export interface MemberDetail extends MemberBrief {
  metrics: MemberWorkloadMetrics;
  active_tasks: TaskBrief[];
}

// --- TASK ---

export interface TaskBrief {
  id: string;
  title: string;
  priority_id: Priority;
  stage: Stage;
  due_date: string;
  is_overdue: boolean;
  requesting_team: RequestingTeam;
  assignee: MemberBrief | null;
  revision_count: number;
  completed_at: string | null;
}

export interface TaskDetail extends TaskBrief {
  description: string;
  review_count: number;
  created_at: string;
  updated_at: string;
}

// --- STAGE EVENT ---

export interface StageEvent {
  id: string;
  from_stage: Stage | null;
  to_stage: Stage;
  transitioned_by: MemberBrief;
  note: string | null;
  occurred_at: string;
}

// --- DASHBOARD ---

export interface StatCardDelta {
  value: number;
  is_positive_trend: boolean;
}

export interface WeeklyDataPoint {
  date: string;
  value: number;
}

export interface StatCard {
  metric_key: 'total_active' | 'overdue' | 'done_this_week' | 'burnout_members';
  label: string;
  value: number;
  unit: string | null;
  delta: StatCardDelta | null;
  weekly_history: WeeklyDataPoint[] | null;
}

export interface PipelineStageCount {
  stage_id: Stage;
  label: string;
  count: number;
  avg_days: number | null;
  is_terminal: boolean;
}

export interface ActionCounts {
  overdue: number;
  p0_unassigned: number;
  burnout_risk: number;
  total: number;
}

export interface DashboardSummary {
  stat_cards: StatCard[];
  pipeline: PipelineStageCount[];
  action_counts: ActionCounts;
  generated_at: string;
}

export interface ActionItem {
  type: ActionItemType;
  severity: Severity;
  description: string;
  task: TaskBrief | null;
  member: MemberBrief | null;
  created_at: string;
}

// --- HEALTH ---

export interface TeamHealthSummary {
  members: MemberDetail[];
  burnout_count: number;
  warn_count: number;
  idle_count: number;
  ok_count: number;
  generated_at: string;
}

// --- DISPATCH (Phase 2) ---

export interface WorkloadImpact {
  from_before: number;
  from_after: number;
  to_before: number;
  to_after: number;
}

export interface DispatchSuggestion {
  id: string;
  task: TaskBrief;
  from_member: MemberBrief;
  to_member: MemberBrief;
  workload_impact: WorkloadImpact;
  rationale: string;
  status: SuggestionStatus;
}

export interface DispatchSession {
  id: string;
  created_at: string;
  status: DispatchSessionStatus;
  suggestions: DispatchSuggestion[];
  summary_message: string | null;
}

// --- NOTIFICATION PREFERENCES (Phase 2) ---

export interface NotificationPreferences {
  telegram_enabled: boolean;
  alert_scope: AlertScope;
  p0_threshold_minutes: 15 | 30 | 60;
}

// --- API RESPONSE WRAPPERS ---

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
  request_id: string;
  violations?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

// --- UI STATE ---

export type QuickFilter = 'all' | 'overdue' | 'p0_unassigned' | 'burnout';
export type SortMode = 'urgency' | 'workload_desc' | 'workload_asc' | 'idle_first' | 'az';
export type HealthFilter = 'all' | 'burnout' | 'warn' | 'idle' | 'ok';
export interface HealthSort { col: string; dir: 'asc' | 'desc'; }
