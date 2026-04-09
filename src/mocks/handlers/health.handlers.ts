import { http, HttpResponse } from 'msw';
import { mockMembers } from '../data/mock.members';
import { mockTasks } from '../data/mock.tasks';

export const healthHandlers = [
  http.get('https://api.nquoc.vn/api/v1/it/health/team', () => {
    const members = mockMembers.map(m => ({
      ...m,
      active_tasks: mockTasks.filter(t => t.assignee?.id === m.id && t.stage !== 'done'),
    }));

    return HttpResponse.json({
      data: {
        members,
        burnout_count: members.filter(m => m.workload_status === 'burnout').length,
        warn_count: members.filter(m => m.workload_status === 'warn').length,
        idle_count: members.filter(m => m.workload_status === 'idle').length,
        ok_count: members.filter(m => m.workload_status === 'ok').length,
        generated_at: new Date().toISOString(),
      },
    });
  }),
];
