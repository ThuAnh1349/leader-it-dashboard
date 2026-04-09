import type { MemberDetail } from '../../types/it.types';

export const mockMembers: MemberDetail[] = [
  // --- 2 BURNOUT ---
  {
    id: 'mem-001', full_name: 'Nguyễn Minh Khoa', avatar_url: null,
    member_type: 'exp', workload_status: 'burnout', active_tasks_count: 6,
    metrics: { active_tasks_count: 6, overdue_count: 3, revision_count: 4, feedback_issues: 3, idle_days: 0, max_tasks_capacity: 5 },
    active_tasks: [],
  },
  {
    id: 'mem-002', full_name: 'Trần Thị Lan Anh', avatar_url: null,
    member_type: 'vibe', workload_status: 'burnout', active_tasks_count: 3,
    metrics: { active_tasks_count: 3, overdue_count: 2, revision_count: 2, feedback_issues: 1, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  // --- 4 WARN ---
  {
    id: 'mem-003', full_name: 'Lê Văn Hùng', avatar_url: null,
    member_type: 'exp', workload_status: 'warn', active_tasks_count: 4,
    metrics: { active_tasks_count: 4, overdue_count: 1, revision_count: 1, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 5 },
    active_tasks: [],
  },
  {
    id: 'mem-004', full_name: 'Phạm Ngọc Bảo', avatar_url: null,
    member_type: 'vibe', workload_status: 'warn', active_tasks_count: 3,
    metrics: { active_tasks_count: 3, overdue_count: 0, revision_count: 2, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-005', full_name: 'Đinh Thị Hoa', avatar_url: null,
    member_type: 'vibe', workload_status: 'warn', active_tasks_count: 3,
    metrics: { active_tasks_count: 3, overdue_count: 1, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-006', full_name: 'Võ Thanh Tùng', avatar_url: null,
    member_type: 'exp', workload_status: 'warn', active_tasks_count: 4,
    metrics: { active_tasks_count: 4, overdue_count: 0, revision_count: 2, feedback_issues: 1, idle_days: 0, max_tasks_capacity: 5 },
    active_tasks: [],
  },
  // --- 3 IDLE ---
  {
    id: 'mem-007', full_name: 'Hoàng Thị Mai', avatar_url: null,
    member_type: 'vibe', workload_status: 'idle', active_tasks_count: 0,
    metrics: { active_tasks_count: 0, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 5, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-008', full_name: 'Bùi Đức Nam', avatar_url: null,
    member_type: 'vibe', workload_status: 'idle', active_tasks_count: 0,
    metrics: { active_tasks_count: 0, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 3, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-009', full_name: 'Ngô Thị Thanh', avatar_url: null,
    member_type: 'exp', workload_status: 'idle', active_tasks_count: 1,
    metrics: { active_tasks_count: 1, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 2, max_tasks_capacity: 5 },
    active_tasks: [],
  },
  // --- 11 OK ---
  {
    id: 'mem-010', full_name: 'Trịnh Công Sơn', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 2,
    metrics: { active_tasks_count: 2, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-011', full_name: 'Lý Thị Kim Ngân', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 1,
    metrics: { active_tasks_count: 1, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-012', full_name: 'Dương Văn Phúc', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 2,
    metrics: { active_tasks_count: 2, overdue_count: 0, revision_count: 1, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-013', full_name: 'Phan Thị Linh', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 1,
    metrics: { active_tasks_count: 1, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-014', full_name: 'Cao Minh Tuấn', avatar_url: null,
    member_type: 'exp', workload_status: 'ok', active_tasks_count: 3,
    metrics: { active_tasks_count: 3, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 5 },
    active_tasks: [],
  },
  {
    id: 'mem-015', full_name: 'Lưu Thị Phương', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 2,
    metrics: { active_tasks_count: 2, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-016', full_name: 'Đặng Quốc Bảo', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 1,
    metrics: { active_tasks_count: 1, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-017', full_name: 'Hà Thị Ngọc Anh', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 2,
    metrics: { active_tasks_count: 2, overdue_count: 0, revision_count: 1, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-018', full_name: 'Trần Văn Dũng', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 1,
    metrics: { active_tasks_count: 1, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-019', full_name: 'Nguyễn Thị Thu Hà', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 2,
    metrics: { active_tasks_count: 2, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
  {
    id: 'mem-020', full_name: 'Vũ Hoàng Long', avatar_url: null,
    member_type: 'vibe', workload_status: 'ok', active_tasks_count: 1,
    metrics: { active_tasks_count: 1, overdue_count: 0, revision_count: 0, feedback_issues: 0, idle_days: 0, max_tasks_capacity: 3 },
    active_tasks: [],
  },
];
