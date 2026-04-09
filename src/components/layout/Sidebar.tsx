import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/it-ops',         label: 'Dashboard',   icon: '⊞' },
  { to: '/it-ops/tasks',   label: 'Tasks',        icon: '⠿' },
  { to: '/it-ops/members', label: 'Thành viên',   icon: '👥' },
  { to: '/it-ops/health',  label: 'Sức khỏe team',icon: '❤️' },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">N</div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">NQuoc IT</p>
            <p className="text-gray-500 text-[10px] mt-0.5">IT Ops Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/it-ops'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
              }`
            }
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-800">
        <p className="text-gray-600 text-[10px]">Phase 1 · MSW Mock</p>
        <p className="text-gray-700 text-[10px]">team.nquoc.vn/it-ops</p>
      </div>
    </aside>
  );
}
