import { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/dashboard/StatCard';
import { PipelineStrip } from '../components/dashboard/PipelineStrip';
import { QuickFilterBar } from '../components/dashboard/QuickFilterBar';
import { ActionItemList } from '../components/dashboard/ActionItemList';
import { PageHeader } from '../components/layout/PageHeader';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';
import type { QuickFilter } from '../types/it.types';

export function DashboardPage() {
  const { summary, actions, loading, error } = useDashboard();
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('all');

  if (loading) return (
    <div className="p-8">
      <SkeletonLoader lines={6} />
    </div>
  );

  if (error) return (
    <div className="p-8 text-red-400">{error}</div>
  );

  if (!summary) return null;

  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="IT Operations Dashboard"
        subtitle={`Cập nhật ${new Date(summary.generated_at).toLocaleString('vi-VN')}`}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {summary.stat_cards.map(card => (
          <StatCard key={card.metric_key} card={card} />
        ))}
      </div>

      {/* Pipeline */}
      <PipelineStrip pipeline={summary.pipeline} />

      {/* Quick filter */}
      <QuickFilterBar
        counts={summary.action_counts}
        active={activeFilter}
        onChange={setActiveFilter}
      />

      {/* Action items */}
      <ActionItemList items={actions} activeFilter={activeFilter} />
    </div>
  );
}
