import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { MembersPage } from './pages/MembersPage';
import { HealthPage } from './pages/HealthPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-950">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/it-ops" replace />} />
            <Route path="/it-ops" element={<DashboardPage />} />
            <Route path="/it-ops/tasks" element={<TasksPage />} />
            <Route path="/it-ops/members" element={<MembersPage />} />
            <Route path="/it-ops/health" element={<HealthPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
