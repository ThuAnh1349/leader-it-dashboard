import { useState, useEffect } from 'react';
import type { TeamHealthSummary } from '../../types/it.types';
import { SkeletonLoader } from '../shared/SkeletonLoader';

interface AIPanelProps {
  health: TeamHealthSummary | null;
}

function buildAIResponse(health: TeamHealthSummary): string {
  const burnouts = health.members.filter(m => m.workload_status === 'burnout');
  const warns = health.members.filter(m => m.workload_status === 'warn');
  const idles = health.members.filter(m => m.workload_status === 'idle');

  const burnoutHtml = burnouts.map(m =>
    `<strong style="color:#f87171">${m.full_name}</strong> (${m.active_tasks_count} task, ${m.metrics.overdue_count} trễ)`
  ).join(', ');

  const warnHtml = warns.map(m =>
    `<strong style="color:#fbbf24">${m.full_name}</strong> (${m.active_tasks_count} task)`
  ).join(', ');

  const idleHtml = idles.map(m =>
    `<strong style="color:#60a5fa">${m.full_name}</strong> (idle ${m.metrics.idle_days} ngày)`
  ).join(', ');

  return `
    <p>Tôi đã phân tích workload của <strong>${health.members.length} thành viên</strong>. Dưới đây là đánh giá:</p>

    ${burnouts.length > 0 ? `
    <p>🔴 <strong>Cần hành động ngay:</strong><br>
    ${burnoutHtml} đang <span style="background:#7f1d1d;padding:1px 6px;border-radius:4px">burnout</span>.
    Cần phân bổ lại task ngay hôm nay.</p>
    ` : ''}

    ${warns.length > 0 ? `
    <p>⚠️ <strong>Cần theo dõi:</strong><br>
    ${warnHtml} đang tiệm cận giới hạn. Không nên giao thêm task mới.</p>
    ` : ''}

    ${idles.length > 0 ? `
    <p>💤 <strong>Có thể nhận thêm task:</strong><br>
    ${idleHtml} đang nhàn, có thể nhận task từ người burnout.</p>
    ` : ''}

    <p>📋 <strong>Action items:</strong></p>
    <ol>
      ${burnouts.length > 0 ? `<li>✅ Chuyển ít nhất 1–2 task từ người burnout sang người idle/ok</li>` : ''}
      ${warns.length > 0 ? `<li>✅ Không giao task mới cho ${warnHtml} cho đến khi workload giảm</li>` : ''}
      <li>✅ Review lại độ ưu tiên các task P2/P3 để defer nếu cần</li>
      <li>✅ Họp ngắn 15 phút với IT Leader để align về deadline</li>
    </ol>
  `;
}

export function AIPanel({ health }: AIPanelProps) {
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (!health) return;
    setLoading(true);
    // Simulate AI thinking delay
    const timer = setTimeout(() => {
      setHtml(buildAIResponse(health));
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [health]);

  return (
    <div className="bg-gray-900 border border-indigo-900/40 rounded-xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AI</div>
        <p className="text-sm font-semibold text-indigo-300">Phân tích tự động</p>
        {loading && <span className="text-xs text-gray-500 ml-auto animate-pulse">Đang phân tích...</span>}
      </div>

      {loading ? (
        <SkeletonLoader lines={4} />
      ) : (
        <div
          id="ai-bubble"
          className="prose-sm text-gray-300 leading-relaxed [&_strong]:text-gray-100 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
