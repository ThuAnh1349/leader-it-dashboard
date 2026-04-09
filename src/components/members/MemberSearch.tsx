import { useRef } from 'react';

interface MemberSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function MemberSearch({ value, onChange }: MemberSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex-1 max-w-xs">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Tìm tên thành viên..."
        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-8 py-2 text-sm text-gray-100
          placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded-sm">{part}</mark> : part
  );
}
