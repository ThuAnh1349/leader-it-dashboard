import { useState, useRef, useEffect } from 'react';
import type { TeamHealthSummary } from '../../types/it.types';
import { WORKLOAD_STATUS_MAP } from '../../constants/it.constants';

interface ExportButtonProps {
  health: TeamHealthSummary | null;
  onToast: (msg: string) => void;
}

function buildSlackReport(health: TeamHealthSummary): string {
  const ts = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  return [
    `*🏥 IT Team Health Report — ${ts}*`,
    `🔥 Burnout: ${health.burnout_count} | ⚠️ Warn: ${health.warn_count} | 😴 Idle: ${health.idle_count} | ✅ OK: ${health.ok_count}`,
    '',
    health.members.filter(m => m.workload_status === 'burnout').map(m =>
      `🔴 *${m.full_name}* — ${m.active_tasks_count} task, ${m.metrics.overdue_count} trễ`
    ).join('\n'),
    '',
    '_Báo cáo tự động · NQuoc IT Dashboard_',
  ].filter(Boolean).join('\n');
}

function buildMarkdownReport(health: TeamHealthSummary): string {
  const ts = new Date().toISOString().split('T')[0];
  const rows = health.members.map(m =>
    `| ${m.full_name} | ${m.active_tasks_count} | ${m.metrics.overdue_count} | ${m.metrics.revision_count} | ${WORKLOAD_STATUS_MAP[m.workload_status].label} |`
  ).join('\n');

  return `# IT Team Health — ${ts}\n\n| Tên | Task | Trễ | Sửa | Status |\n|-----|------|-----|-----|--------|\n${rows}\n\n*Báo cáo tự động · NQuoc IT Dashboard · ${ts}*`;
}

export function ExportButton({ health, onToast }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  const handlePDF = () => { window.print(); setOpen(false); };

  const handleSlack = async () => {
    if (!health) return;
    await navigator.clipboard.writeText(buildSlackReport(health));
    onToast('Đã copy báo cáo Slack vào clipboard');
    setOpen(false);
  };

  const handleMarkdown = async () => {
    if (!health) return;
    await navigator.clipboard.writeText(buildMarkdownReport(health));
    onToast('Đã copy Markdown vào clipboard');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-gray-600"
      >
        Export <span>▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-40 overflow-hidden">
          <button onClick={handlePDF} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800">📄 Export PDF</button>
          <button onClick={handleSlack} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800">📋 Copy cho Slack</button>
          <button onClick={handleMarkdown} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800">📊 Copy Markdown</button>
        </div>
      )}
    </div>
  );
}
