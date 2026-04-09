import { useState, useEffect, useCallback } from 'react';
import { getTasks, changeTaskStage, assignTask, transferTask } from '../api/it.api';
import type { TaskBrief, Stage, Priority } from '../types/it.types';
import type { ApiError } from '../types/it.types';

export interface TasksFilter {
  priority_id?: Priority;
  assignee_id?: string;
  unassigned_only?: boolean;
}

export interface KanbanData {
  incoming: TaskBrief[];
  in_progress: TaskBrief[];
  in_review: TaskBrief[];
  needs_fix: TaskBrief[];
}

export function useTasks(filter: TasksFilter = {}) {
  const [data, setData] = useState<KanbanData>({ incoming: [], in_progress: [], in_review: [], needs_fix: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks(filter);
      setData(res.data as KanbanData);
    } catch {
      setError('Không thể tải danh sách task');
    } finally {
      setLoading(false);
    }
  }, [filter.priority_id, filter.assignee_id, filter.unassigned_only]);

  useEffect(() => { load(); }, [load]);

  const moveTask = useCallback(async (taskId: string, fromStage: Stage, toStage: Stage): Promise<{ ok: boolean; error?: string }> => {
    // Optimistic update
    setData(prev => {
      const fromKey = fromStage as keyof KanbanData;
      const toKey = toStage as keyof KanbanData;
      if (!(fromKey in prev) || !(toKey in prev)) return prev;
      const task = prev[fromKey].find(t => t.id === taskId);
      if (!task) return prev;
      return {
        ...prev,
        [fromKey]: prev[fromKey].filter(t => t.id !== taskId),
        [toKey]: [...prev[toKey], { ...task, stage: toStage }],
      };
    });

    try {
      await changeTaskStage(taskId, toStage);
      return { ok: true };
    } catch (e) {
      // Revert
      setData(prev => {
        const fromKey = fromStage as keyof KanbanData;
        const toKey = toStage as keyof KanbanData;
        if (!(fromKey in prev) || !(toKey in prev)) return prev;
        const task = prev[toKey].find(t => t.id === taskId);
        if (!task) return prev;
        return {
          ...prev,
          [toKey]: prev[toKey].filter(t => t.id !== taskId),
          [fromKey]: [...prev[fromKey], { ...task, stage: fromStage }],
        };
      });
      const err = e as ApiError;
      return { ok: false, error: err.message ?? 'Không thể chuyển stage' };
    }
  }, []);

  const assignTaskMutation = useCallback(async (taskId: string, memberId: string) => {
    const res = await assignTask(taskId, memberId);
    setData(prev => {
      const updated: KanbanData = { ...prev };
      for (const key of Object.keys(updated) as (keyof KanbanData)[]) {
        updated[key] = updated[key].map(t => t.id === taskId ? res.data : t);
      }
      return updated;
    });
    return res;
  }, []);

  const transferTaskMutation = useCallback(async (taskId: string, toMemberId: string) => {
    const res = await transferTask(taskId, toMemberId);
    setData(prev => {
      const updated: KanbanData = { ...prev };
      for (const key of Object.keys(updated) as (keyof KanbanData)[]) {
        updated[key] = updated[key].map(t => t.id === taskId ? res.data : t);
      }
      return updated;
    });
    return res;
  }, []);

  return { data, loading, error, reload: load, moveTask, assignTask: assignTaskMutation, transferTask: transferTaskMutation };
}
