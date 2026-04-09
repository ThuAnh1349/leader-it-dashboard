import { useNavigate, useSearchParams } from 'react-router-dom';
import type { PipelineStageCount } from '../../types/it.types';

interface PipelineStripProps {
  pipeline: PipelineStageCount[];
}

const STAGE_ICONS: Record<string, string> = {
  incoming: '📥',
  in_progress: '⚙️',
  in_review: '🔍',
  needs_fix: '🔧',
  done: '✅',
};

export function PipelineStrip({ pipeline }: PipelineStripProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const activeStage = params.get('stage');

  const handleClick = (stageId: string) => {
    if (activeStage === stageId) {
      navigate('/it-ops/tasks');
    } else {
      navigate(`/it-ops/tasks?stage=${stageId}`);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-5">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Pipeline Tasks</p>
      <div className="flex gap-2">
        {pipeline.map((stage, idx) => {
          const isActive = activeStage === stage.stage_id;
          const isTerminal = stage.is_terminal;
          return (
            <button
              key={stage.stage_id}
              onClick={() => handleClick(stage.stage_id)}
              title={stage.avg_days !== null ? `${stage.count} tasks · TB ${stage.avg_days} ngày` : `${stage.count} tasks`}
              className={`group relative flex-1 flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border transition-all
                ${isTerminal
                  ? 'border-green-800/60 bg-green-950/30 hover:bg-green-900/30'
                  : isActive
                    ? 'border-indigo-500 bg-indigo-900/30'
                    : 'border-gray-800 bg-gray-800/30 hover:border-gray-700 hover:bg-gray-800/60'
                }`}
            >
              <span className="text-lg">{STAGE_ICONS[stage.stage_id]}</span>
              <span className={`text-[11px] font-medium ${isTerminal ? 'text-green-400' : isActive ? 'text-indigo-300' : 'text-gray-400'}`}>
                {stage.label}
              </span>
              <span className={`text-xl font-bold ${isTerminal ? 'text-green-300' : isActive ? 'text-white' : 'text-gray-200'}`}>
                {stage.count}
              </span>
              {stage.avg_days !== null && (
                <span className="text-[10px] text-gray-600">TB {stage.avg_days}d</span>
              )}
              {idx < pipeline.length - 1 && !isTerminal && (
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-gray-700 text-xs z-10">→</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
