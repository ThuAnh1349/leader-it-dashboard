interface MemberFilterChipProps {
  name: string;
  onRemove: () => void;
}

export function MemberFilterChip({ name, onRemove }: MemberFilterChipProps) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-900/40 border border-indigo-700 rounded-full text-sm text-indigo-300">
      <span>👤</span>
      <span className="font-medium">{name}</span>
      <button
        onClick={onRemove}
        className="text-indigo-400 hover:text-indigo-200 ml-0.5 leading-none"
      >
        ×
      </button>
    </div>
  );
}
