import { http, HttpResponse } from 'msw';
import { mockDashboardSummary, mockActionItems } from '../data/mock.dashboard';

export const dashboardHandlers = [
  http.get('https://api.nquoc.vn/api/v1/it/dashboard/summary', () =>
    HttpResponse.json({ data: mockDashboardSummary })
  ),

  http.get('https://api.nquoc.vn/api/v1/it/dashboard/actions', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const filtered = type
      ? mockActionItems.filter(a => a.type === type)
      : mockActionItems;
    return HttpResponse.json({ data: filtered });
  }),
];
