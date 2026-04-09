import type { TaskBrief } from '../../types/it.types';
import { mockMembers } from './mock.members';

const m = (id: string) => {
  const found = mockMembers.find(m => m.id === id);
  if (!found) return null;
  const { metrics: _, active_tasks: __, ...brief } = found;
  return brief;
};

export const mockTasks: TaskBrief[] = [
  // --- INCOMING (7 tasks) ---
  {
    id: 'IT-001', title: 'Cấu hình VPN cho phòng Finance sau khi đổi ISP', priority_id: 'p0',
    stage: 'incoming', due_date: '2026-04-09', is_overdue: true,
    requesting_team: 'Finance', assignee: null, revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-002', title: 'Nâng cấp Windows 11 cho 10 máy phòng HR', priority_id: 'p1',
    stage: 'incoming', due_date: '2026-04-12', is_overdue: false,
    requesting_team: 'HR', assignee: null, revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-003', title: 'Cài đặt phần mềm kế toán MISA cho máy mới', priority_id: 'p2',
    stage: 'incoming', due_date: '2026-04-15', is_overdue: false,
    requesting_team: 'Finance', assignee: null, revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-004', title: 'Kiểm tra firewall rules cho hệ thống CRM mới', priority_id: 'p0',
    stage: 'incoming', due_date: '2026-04-08', is_overdue: true,
    requesting_team: 'CRM', assignee: null, revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-005', title: 'Backup dữ liệu server kho vận trước nâng cấp', priority_id: 'p1',
    stage: 'incoming', due_date: '2026-04-10', is_overdue: false,
    requesting_team: 'WH', assignee: m('mem-007'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-006', title: 'Setup tài khoản email cho 3 nhân viên mới phòng MKT', priority_id: 'p2',
    stage: 'incoming', due_date: '2026-04-11', is_overdue: false,
    requesting_team: 'MKT', assignee: null, revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-007', title: 'Kiểm tra log truy cập bất thường vào hệ thống Admin', priority_id: 'p1',
    stage: 'incoming', due_date: '2026-04-09', is_overdue: true,
    requesting_team: 'Security', assignee: null, revision_count: 0, completed_at: null,
  },
  // --- IN_PROGRESS (8 tasks) ---
  {
    id: 'IT-008', title: 'Triển khai hệ thống monitoring Grafana cho Infra', priority_id: 'p0',
    stage: 'in_progress', due_date: '2026-04-10', is_overdue: false,
    requesting_team: 'Infra', assignee: m('mem-001'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-009', title: 'Migrate database CRM từ v5.2 lên v6.0', priority_id: 'p1',
    stage: 'in_progress', due_date: '2026-04-11', is_overdue: false,
    requesting_team: 'CRM', assignee: m('mem-003'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-010', title: 'Phát triển script tự động sync dữ liệu kho', priority_id: 'p2',
    stage: 'in_progress', due_date: '2026-04-08', is_overdue: true,
    requesting_team: 'WH', assignee: m('mem-006'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-011', title: 'Cấu hình SSL certificate cho domain mới của MKT', priority_id: 'p1',
    stage: 'in_progress', due_date: '2026-04-12', is_overdue: false,
    requesting_team: 'MKT', assignee: m('mem-014'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-012', title: 'Triển khai 2FA cho toàn bộ tài khoản Admin panel', priority_id: 'p0',
    stage: 'in_progress', due_date: '2026-04-09', is_overdue: true,
    requesting_team: 'Security', assignee: m('mem-001'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-013', title: 'Cài đặt và cấu hình printer mới tại kho WH-02', priority_id: 'p3',
    stage: 'in_progress', due_date: '2026-04-14', is_overdue: false,
    requesting_team: 'WH', assignee: m('mem-010'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-014', title: 'Tối ưu query chậm trong báo cáo Finance tháng 3', priority_id: 'p1',
    stage: 'in_progress', due_date: '2026-04-10', is_overdue: false,
    requesting_team: 'Finance', assignee: m('mem-003'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-015', title: 'Khắc phục lỗi đồng bộ tồn kho realtime trong WMS', priority_id: 'p0',
    stage: 'in_progress', due_date: '2026-04-09', is_overdue: true,
    requesting_team: 'WH', assignee: m('mem-002'), revision_count: 0, completed_at: null,
  },
  // --- IN_REVIEW (6 tasks) ---
  {
    id: 'IT-016', title: 'Refactor module xác thực phân quyền user trong portal', priority_id: 'p1',
    stage: 'in_review', due_date: '2026-04-11', is_overdue: false,
    requesting_team: 'Admin', assignee: m('mem-006'), revision_count: 1, completed_at: null,
  },
  {
    id: 'IT-017', title: 'Tích hợp API thanh toán VNPay vào hệ thống bán lẻ', priority_id: 'p0',
    stage: 'in_review', due_date: '2026-04-10', is_overdue: false,
    requesting_team: 'Finance', assignee: m('mem-014'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-018', title: 'Viết tài liệu kỹ thuật cho hệ thống HR portal v2', priority_id: 'p2',
    stage: 'in_review', due_date: '2026-04-13', is_overdue: false,
    requesting_team: 'HR', assignee: m('mem-012'), revision_count: 2, completed_at: null,
  },
  {
    id: 'IT-019', title: 'Kiểm tra và vá lỗ hổng bảo mật từ báo cáo pentest', priority_id: 'p0',
    stage: 'in_review', due_date: '2026-04-07', is_overdue: true,
    requesting_team: 'Security', assignee: m('mem-001'), revision_count: 3, completed_at: null,
  },
  {
    id: 'IT-020', title: 'Thiết lập disaster recovery plan cho database chính', priority_id: 'p1',
    stage: 'in_review', due_date: '2026-04-11', is_overdue: false,
    requesting_team: 'Infra', assignee: m('mem-006'), revision_count: 0, completed_at: null,
  },
  {
    id: 'IT-021', title: 'Đánh giá và chọn vendor CDN cho static assets', priority_id: 'p2',
    stage: 'in_review', due_date: '2026-04-15', is_overdue: false,
    requesting_team: 'Infra', assignee: m('mem-009'), revision_count: 1, completed_at: null,
  },
  // --- NEEDS_FIX (4 tasks) ---
  {
    id: 'IT-022', title: 'Sửa lỗi scheduler job bị trùng lặp trong hệ thống batch', priority_id: 'p0',
    stage: 'needs_fix', due_date: '2026-04-08', is_overdue: true,
    requesting_team: 'Infra', assignee: m('mem-001'), revision_count: 2, completed_at: null,
  },
  {
    id: 'IT-023', title: 'Sửa report tổng hợp lương bị sai định dạng tiền tệ', priority_id: 'p1',
    stage: 'needs_fix', due_date: '2026-04-09', is_overdue: true,
    requesting_team: 'HR', assignee: m('mem-002'), revision_count: 1, completed_at: null,
  },
  {
    id: 'IT-024', title: 'Fix bug popup bị che khuất trên mobile cho CRM app', priority_id: 'p2',
    stage: 'needs_fix', due_date: '2026-04-10', is_overdue: false,
    requesting_team: 'CRM', assignee: m('mem-017'), revision_count: 1, completed_at: null,
  },
  {
    id: 'IT-025', title: 'Khắc phục lỗi import Excel bị crash khi file > 5MB', priority_id: 'p1',
    stage: 'needs_fix', due_date: '2026-04-11', is_overdue: false,
    requesting_team: 'Finance', assignee: m('mem-005'), revision_count: 2, completed_at: null,
  },
  // --- DONE (bonus for history) ---
  {
    id: 'IT-026', title: 'Cài đặt antivirus Kaspersky cho 30 máy trạm', priority_id: 'p2',
    stage: 'done', due_date: '2026-04-05', is_overdue: false,
    requesting_team: 'Security', assignee: m('mem-011'), revision_count: 0, completed_at: '2026-04-05T14:30:00Z',
  },
  {
    id: 'IT-027', title: 'Nâng cấp RAM server DB lên 128GB', priority_id: 'p1',
    stage: 'done', due_date: '2026-04-06', is_overdue: false,
    requesting_team: 'Infra', assignee: m('mem-009'), revision_count: 0, completed_at: '2026-04-06T10:00:00Z',
  },
  {
    id: 'IT-028', title: 'Thiết lập monitoring cảnh báo disk > 80%', priority_id: 'p1',
    stage: 'done', due_date: '2026-04-07', is_overdue: false,
    requesting_team: 'Infra', assignee: m('mem-014'), revision_count: 0, completed_at: '2026-04-07T16:00:00Z',
  },
];

// Assign active_tasks back to members
export function getMembersWithTasks(): import('../../types/it.types').MemberDetail[] {
  const { mockMembers: members } = require('./mock.members');
  return members.map((member: import('../../types/it.types').MemberDetail) => ({
    ...member,
    active_tasks: mockTasks.filter(t =>
      t.assignee?.id === member.id && t.stage !== 'done'
    ),
  }));
}
