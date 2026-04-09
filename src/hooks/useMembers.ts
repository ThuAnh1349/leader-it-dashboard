import { useState, useEffect, useCallback } from 'react';
import { getMembers, getMember } from '../api/it.api';
import type { MemberDetail } from '../types/it.types';

export function useMembers() {
  const [members, setMembers] = useState<MemberDetail[]>([]);
  const [summary, setSummary] = useState({ total: 0, exp_count: 0, vibe_count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMembers();
      setMembers(res.data);
      setSummary(res.summary);
    } catch {
      setError('Không thể tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadMember = useCallback(async (id: string): Promise<MemberDetail | null> => {
    try {
      const res = await getMember(id);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  return { members, summary, loading, error, reload: load, loadMember };
}
