import { http, HttpResponse } from 'msw';
import { mockMembers } from '../data/mock.members';
import { mockTasks } from '../data/mock.tasks';
import type { WorkloadStatus } from '../../types/it.types';

export const membersHandlers = [
  http.get('https://api.nquoc.vn/api/v1/it/members', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('workload_status') as WorkloadStatus | null;

    const members = mockMembers.map(m => ({
      ...m,
      active_tasks: mockTasks.filter(t => t.assignee?.id === m.id && t.stage !== 'done'),
    }));

    const filtered = status ? members.filter(m => m.workload_status === status) : members;

    return HttpResponse.json({
      data: filtered,
      summary: {
        total: filtered.length,
        exp_count: filtered.filter(m => m.member_type === 'exp').length,
        vibe_count: filtered.filter(m => m.member_type === 'vibe').length,
      },
    });
  }),

  http.get('https://api.nquoc.vn/api/v1/it/members/:id', ({ params }) => {
    const member = mockMembers.find(m => m.id === params.id);
    if (!member) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Member not found', request_id: 'req_mock' },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      data: {
        ...member,
        active_tasks: mockTasks.filter(t => t.assignee?.id === member.id && t.stage !== 'done'),
      },
    });
  }),
];
