import { useState, useEffect, useCallback } from 'react';
import { getTeamHealth } from '../api/it.api';
import type { TeamHealthSummary } from '../types/it.types';

export function useTeamHealth() {
  const [health, setHealth] = useState<TeamHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeamHealth();
      setHealth(res.data);
    } catch {
      setError('Không thể tải dữ liệu health');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { health, loading, error, reload: load };
}
