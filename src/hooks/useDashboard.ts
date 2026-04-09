import { useState, useEffect, useCallback } from 'react';
import { getDashboardSummary, getDashboardActions } from '../api/it.api';
import type { DashboardSummary, ActionItem } from '../types/it.types';

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, a] = await Promise.all([getDashboardSummary(), getDashboardActions()]);
      setSummary(s.data);
      setActions(a.data);
    } catch {
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { summary, actions, loading, error, reload: load };
}
