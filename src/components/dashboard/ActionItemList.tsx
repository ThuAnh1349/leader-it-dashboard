import { useState, useEffect } from 'react';
import type { ActionItem, QuickFilter } from '../../types/it.types';
import { Avatar } from '../shared/Avatar';
import { PriorityBadge } from '../shared/PriorityBadge';

const SECTIONS = [
  { type: 'overdue' as const,       icon: '🔴', label: 'Trễ Deadline',   key: 'overdue' },
  { type: 'p0_unassigned' as const, icon: '⚡', label: 'P0 Chưa Nhận',  key: 'p0_unassigned' },
  { type: 'burnout_risk' as const,  icon: '🔥', label: 'Burnout Risk',   key: 'burnout_risk' },
];

interface ActionItemListProps {
  items: ActionItem[];
  activeFilter: QuickFilter;
}

export function ActionItemList({ items, activeFilter }: ActionItemListProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('it_action_collapsed') ?? '{}'); } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('it_action_collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggle = (key: string) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  const visibleSections = activeFilter === 'all'
    ? SECTIONS
    : SECTIONS.filter(s => s.type === activeFilter || (activeFilter === 'burnout' && s.type === 'burnout_risk'));

  return (
    <div className="space-y-3">
      <h2 className="text-gray-300 text-sm font-semibold">Action Items</h2>
      {visibleSections.map(sec => {
        const sItems = items.filter(i => i.type === sec.type);
        const isOpen = sItems.length > 0 ? !collapsed[sec.key] : false;

        return (
          <div key={sec.key} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(sec.key)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{sec.icon}</span>
                <span className="text-sm font-medium text-gray-200">{sec.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  sItems.length > 0 ? 'bg-red-900/60 text-red-300' : 'bg-gray-800 text-gray-500'
                }`}>{sItems.length}</span>
              </div>
              <span className={`text-gray-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            <div
              className="overflow-hidden transition-all duration-200"
              style={{ maxHeight: isOpen ? `${sItems.length * 80 + 8}px` : '0' }}
            >
              {sItems.length === 0 ? (
                <p className="px-4 pb-3 text-sm text-gray-500 italic">✅ Không có vấn đề</p>
              ) : (
                <div className="divide-y divide-gray-800">
                  {sItems.map((item, i) => (
                    <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-800/30 transition-colors">
                      <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                        item.severity === 'critical' ? 'bg-red-500' : item.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 leading-snug">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {item.task && <PriorityBadge priority={item.task.priority_id} />}
                          {item.task && <span className="text-xs text-gray-500 font-mono">{item.task.id}</span>}
                          {item.member && (
                            <div className="flex items-center gap-1">
                              <Avatar name={item.member.full_name} status={item.member.workload_status} size={16} showDot={false} />
                              <span className="text-xs text-gray-400">{item.member.full_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
