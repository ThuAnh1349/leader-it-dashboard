import type { DashboardSummary, ActionItem } from '../../types/it.types';
import { mockTasks } from './mock.tasks';
import { mockMembers } from './mock.members';

export const mockDashboardSummary: DashboardSummary = {
  stat_cards: [
    {
      metric_key: 'total_active',
      label: 'Task đang chạy',
      value: 25,
      unit: 'tasks',
      delta: { value: 3, is_positive_trend: false },
      weekly_history: [
        { date: '2026-04-03', value: 18 },
        { date: '2026-04-04', value: 20 },
        { date: '2026-04-05', value: 22 },
        { date: '2026-04-06', value: 21 },
        { date: '2026-04-07', value: 23 },
        { date: '2026-04-08', value: 24 },
        { date: '2026-04-09', value: 25 },
      ],
    },
    {
      metric_key: 'overdue',
      label: 'Quá hạn',
      value: 7,
      unit: 'tasks',
      delta: { value: 2, is_positive_trend: false },
      weekly_history: [
        { date: '2026-04-03', value: 3 },
        { date: '2026-04-04', value: 4 },
        { date: '2026-04-05', value: 4 },
        { date: '2026-04-06', value: 5 },
        { date: '2026-04-07', value: 5 },
        { date: '2026-04-08', value: 6 },
        { date: '2026-04-09', value: 7 },
      ],
    },
    {
      metric_key: 'done_this_week',
      label: 'Hoàn thành tuần này',
      value: 3,
      unit: 'tasks',
      delta: { value: 1, is_positive_trend: true },
      weekly_history: [
        { date: '2026-04-03', value: 0 },
        { date: '2026-04-04', value: 0 },
        { date: '2026-04-05', value: 1 },
        { date: '2026-04-06', value: 1 },
        { date: '2026-04-07', value: 2 },
        { date: '2026-04-08', value: 3 },
        { date: '2026-04-09', value: 3 },
      ],
    },
    {
      metric_key: 'burnout_members',
      label: 'Thành viên burnout',
      value: 2,
      unit: 'người',
      delta: { value: 1, is_positive_trend: false },
      weekly_history: [
        { date: '2026-04-03', value: 0 },
        { date: '2026-04-04', value: 1 },
        { date: '2026-04-05', value: 1 },
        { date: '2026-04-06', value: 1 },
        { date: '2026-04-07', value: 2 },
        { date: '2026-04-08', value: 2 },
        { date: '2026-04-09', value: 2 },
      ],
    },
  ],
  pipeline: [
    { stage_id: 'incoming',    label: 'Chờ nhận',    count: 7,  avg_days: 1.4, is_terminal: false },
    { stage_id: 'in_progress', label: 'Đang làm',   count: 8,  avg_days: 2.8, is_terminal: false },
    { stage_id: 'in_review',   label: 'Chờ review', count: 6,  avg_days: 1.2, is_terminal: false },
    { stage_id: 'needs_fix',   label: 'Cần sửa',    count: 4,  avg_days: 0.8, is_terminal: false },
    { stage_id: 'done',        label: 'Hoàn thành', count: 3,  avg_days: null, is_terminal: true },
  ],
  action_counts: {
    overdue: 7,
    p0_unassigned: 2,
    burnout_risk: 2,
    total: 11,
  },
  generated_at: '2026-04-09T08:00:00Z',
};

const m = (id: string) => {
  const found = mockMembers.find(m => m.id === id);
  if (!found) return null;
  const { metrics: _, active_tasks: __, ...brief } = found;
  return brief;
};

const t = (id: string) => mockTasks.find(t => t.id === id) ?? null;

export const mockActionItems: ActionItem[] = [
  // Overdue
  {
    type: 'overdue', severity: 'critical',
    description: 'IT-001 cấu hình VPN Finance đã quá hạn hôm nay và chưa được nhận',
    task: t('IT-001'), member: null,
    created_at: '2026-04-09T07:00:00Z',
  },
  {
    type: 'overdue', severity: 'critical',
    description: 'IT-004 kiểm tra firewall CRM đã quá hạn từ hôm qua',
    task: t('IT-004'), member: null,
    created_at: '2026-04-09T07:05:00Z',
  },
  {
    type: 'overdue', severity: 'high',
    description: 'IT-012 triển khai 2FA đã quá hạn, Khoa đang xử lý nhưng trễ',
    task: t('IT-012'), member: m('mem-001'),
    created_at: '2026-04-09T07:10:00Z',
  },
  {
    type: 'overdue', severity: 'high',
    description: 'IT-015 lỗi sync kho WMS quá hạn, Lan Anh đang fix',
    task: t('IT-015'), member: m('mem-002'),
    created_at: '2026-04-09T07:15:00Z',
  },
  {
    type: 'overdue', severity: 'high',
    description: 'IT-007 log truy cập bất thường chưa được nhận và đã quá hạn',
    task: t('IT-007'), member: null,
    created_at: '2026-04-09T07:20:00Z',
  },
  {
    type: 'overdue', severity: 'medium',
    description: 'IT-010 script sync kho WH quá hạn từ hôm qua, Tùng đang làm',
    task: t('IT-010'), member: m('mem-006'),
    created_at: '2026-04-09T07:25:00Z',
  },
  {
    type: 'overdue', severity: 'critical',
    description: 'IT-019 vá lỗ hổng pentest đang review nhưng đã quá hạn 2 ngày',
    task: t('IT-019'), member: m('mem-001'),
    created_at: '2026-04-09T07:30:00Z',
  },
  // P0 unassigned
  {
    type: 'p0_unassigned', severity: 'critical',
    description: 'IT-001 cấu hình VPN Finance ưu tiên P0 chưa có người nhận',
    task: t('IT-001'), member: null,
    created_at: '2026-04-09T07:35:00Z',
  },
  {
    type: 'p0_unassigned', severity: 'critical',
    description: 'IT-004 kiểm tra firewall CRM ưu tiên P0 chưa có người nhận',
    task: t('IT-004'), member: null,
    created_at: '2026-04-09T07:40:00Z',
  },
  // Burnout risk
  {
    type: 'burnout_risk', severity: 'critical',
    description: 'Nguyễn Minh Khoa đang xử lý 6 task (quá capacity 5), 3 task trễ',
    task: null, member: m('mem-001'),
    created_at: '2026-04-09T07:45:00Z',
  },
  {
    type: 'burnout_risk', severity: 'high',
    description: 'Trần Thị Lan Anh đang xử lý 3 task (đạt capacity vibe coder), 2 task trễ',
    task: null, member: m('mem-002'),
    created_at: '2026-04-09T07:50:00Z',
  },
];
