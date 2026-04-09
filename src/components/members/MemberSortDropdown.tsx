import { useState, useRef, useEffect } from 'react';
import type { SortMode } from '../../types/it.types';

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'urgency',      label: 'Urgency (Burnout → Warn → OK → Idle)' },
  { value: 'workload_desc', label: 'Workload cao → thấp' },
  { value: 'workload_asc', label: 'Workload thấp → cao' },
  { value: 'idle_first',   label: 'Idle trước' },
  { value: 'az',           label: 'A – Z' },
];

interface MemberSortDropdownProps {
  value: SortMode;
  onChange: (v: SortMode) => void;
}

export function MemberSortDropdown({ value, onChange }: MemberSortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  const current = OPTIONS.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-gray-600"
      >
        <span>↕</span>
        <span className="hidden sm:inline">{current?.label ?? 'Sắp xếp'}</span>
        <span>▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-40 overflow-hidden">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors
                ${value === opt.value ? 'text-indigo-400 font-medium' : 'text-gray-300'}`}
            >
              {value === opt.value && <span className="mr-2">✓</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
