import { setupWorker } from 'msw/browser';
import { dashboardHandlers } from './handlers/dashboard.handlers';
import { tasksHandlers } from './handlers/tasks.handlers';
import { membersHandlers } from './handlers/members.handlers';
import { healthHandlers } from './handlers/health.handlers';

export const worker = setupWorker(
  ...dashboardHandlers,
  ...tasksHandlers,
  ...membersHandlers,
  ...healthHandlers,
);
