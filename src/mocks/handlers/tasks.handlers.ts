import { http, HttpResponse } from 'msw';
import { mockTasks } from '../data/mock.tasks';
import type { TaskBrief, Stage } from '../../types/it.types';
import { VALID_TRANSITIONS } from '../../constants/it.constants';
import { mockMembers } from '../data/mock.members';

// In-memory store
let tasks: TaskBrief[] = [...mockTasks];

export const tasksHandlers = [
  // GET /tasks
  http.get('https://api.nquoc.vn/api/v1/it/tasks', ({ request }) => {
    const url = new URL(request.url);
    const priority_id = url.searchParams.get('priority_id');
    const assignee_id = url.searchParams.get('assignee_id');
    const unassigned_only = url.searchParams.get('unassigned_only');

    let active = tasks.filter(t => t.stage !== 'done');
    if (priority_id) active = active.filter(t => t.priority_id === priority_id);
    if (assignee_id) active = active.filter(t => t.assignee?.id === assignee_id);
    if (unassigned_only === 'true') active = active.filter(t => !t.assignee);

    const grouped = {
      incoming: active.filter(t => t.stage === 'incoming'),
      in_progress: active.filter(t => t.stage === 'in_progress'),
      in_review: active.filter(t => t.stage === 'in_review'),
      needs_fix: active.filter(t => t.stage === 'needs_fix'),
    };
    return HttpResponse.json({ data: grouped, total_active: active.length });
  }),

  // GET /tasks/:id
  http.get('https://api.nquoc.vn/api/v1/it/tasks/:id', ({ params }) => {
    const task = tasks.find(t => t.id === params.id);
    if (!task) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Task not found', request_id: 'req_mock' }, { status: 404 });
    return HttpResponse.json({ data: { ...task, description: '', review_count: task.revision_count, created_at: '2026-04-01T00:00:00Z', updated_at: new Date().toISOString() } });
  }),

  // PATCH /tasks/:id
  http.patch('https://api.nquoc.vn/api/v1/it/tasks/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<TaskBrief>;
    const idx = tasks.findIndex(t => t.id === params.id);
    if (idx === -1) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Task not found', request_id: 'req_mock' }, { status: 404 });
    tasks[idx] = { ...tasks[idx], ...body };
    return HttpResponse.json({ data: tasks[idx] });
  }),

  // POST /tasks/:id/stage
  http.post('https://api.nquoc.vn/api/v1/it/tasks/:id/stage', async ({ params, request }) => {
    const body = await request.json() as { to_stage: Stage; note?: string };
    const idx = tasks.findIndex(t => t.id === params.id);
    if (idx === -1) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Task not found', request_id: 'req_mock' }, { status: 404 });
    const task = tasks[idx];
    if (task.stage === 'done') {
      return HttpResponse.json({ code: 'TASK_ALREADY_DONE', message: 'Task đã hoàn thành.', request_id: 'req_mock' }, { status: 422 });
    }
    const validNext = VALID_TRANSITIONS[task.stage];
    if (!validNext.includes(body.to_stage)) {
      return HttpResponse.json({
        code: 'INVALID_STAGE_TRANSITION',
        message: `Không thể chuyển từ ${task.stage} sang ${body.to_stage}.`,
        request_id: 'req_mock',
        violations: [{ field: 'to_stage', code: 'INVALID_TRANSITION', message: 'Invalid transition' }],
      }, { status: 422 });
    }
    let newRevision = task.revision_count;
    if (task.stage === 'in_review' && body.to_stage === 'needs_fix') newRevision++;
    tasks[idx] = {
      ...task,
      stage: body.to_stage,
      revision_count: newRevision,
      completed_at: body.to_stage === 'done' ? new Date().toISOString() : task.completed_at,
    };
    return HttpResponse.json({ data: tasks[idx] });
  }),

  // POST /tasks/:id/assign
  http.post('https://api.nquoc.vn/api/v1/it/tasks/:id/assign', async ({ params, request }) => {
    const body = await request.json() as { member_id: string };
    const idx = tasks.findIndex(t => t.id === params.id);
    if (idx === -1) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Task not found', request_id: 'req_mock' }, { status: 404 });
    if (tasks[idx].assignee) {
      return HttpResponse.json({ code: 'TASK_ALREADY_ASSIGNED', message: 'Task đã được giao.', request_id: 'req_mock' }, { status: 409 });
    }
    const member = mockMembers.find(m => m.id === body.member_id);
    if (!member) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Member not found', request_id: 'req_mock' }, { status: 404 });
    const { metrics: _, active_tasks: __, ...brief } = member;
    tasks[idx] = { ...tasks[idx], assignee: brief };
    const warning = member.workload_status === 'burnout' ? 'Member đang burnout' : undefined;
    return HttpResponse.json({ data: tasks[idx], workload_warning: warning });
  }),

  // POST /tasks/:id/transfer
  http.post('https://api.nquoc.vn/api/v1/it/tasks/:id/transfer', async ({ params, request }) => {
    const body = await request.json() as { to_member_id: string; reason?: string };
    const idx = tasks.findIndex(t => t.id === params.id);
    if (idx === -1) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Task not found', request_id: 'req_mock' }, { status: 404 });
    if (!tasks[idx].assignee) {
      return HttpResponse.json({ code: 'TASK_NOT_ASSIGNED', message: 'Task chưa được giao.', request_id: 'req_mock' }, { status: 409 });
    }
    if (tasks[idx].assignee?.id === body.to_member_id) {
      return HttpResponse.json({ code: 'TRANSFER_TO_SAME_MEMBER', message: 'Không thể chuyển cho cùng người.', request_id: 'req_mock' }, { status: 422 });
    }
    const toMember = mockMembers.find(m => m.id === body.to_member_id);
    if (!toMember) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Member not found', request_id: 'req_mock' }, { status: 404 });
    const { metrics: _, active_tasks: __, ...brief } = toMember;
    tasks[idx] = { ...tasks[idx], assignee: brief };
    return HttpResponse.json({ data: tasks[idx] });
  }),

  // GET /tasks/:id/history
  http.get('https://api.nquoc.vn/api/v1/it/tasks/:id/history', ({ params }) => {
    const task = tasks.find(t => t.id === params.id);
    if (!task) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Task not found', request_id: 'req_mock' }, { status: 404 });
    const member = mockMembers[0];
    const { metrics: _, active_tasks: __, ...brief } = member;
    const events = task.revision_count > 0 ? [
      { id: 'evt-1', from_stage: null, to_stage: 'incoming', transitioned_by: brief, note: null, occurred_at: '2026-04-01T09:00:00Z' },
      { id: 'evt-2', from_stage: 'incoming', to_stage: 'in_progress', transitioned_by: brief, note: null, occurred_at: '2026-04-02T10:00:00Z' },
      { id: 'evt-3', from_stage: 'in_progress', to_stage: 'in_review', transitioned_by: brief, note: null, occurred_at: '2026-04-04T14:00:00Z' },
      { id: 'evt-4', from_stage: 'in_review', to_stage: 'needs_fix', transitioned_by: brief, note: 'Cần fix logic validation', occurred_at: '2026-04-05T11:00:00Z' },
    ] : [
      { id: 'evt-1', from_stage: null, to_stage: 'incoming', transitioned_by: brief, note: null, occurred_at: '2026-04-01T09:00:00Z' },
    ];
    return HttpResponse.json({ data: events });
  }),
];
