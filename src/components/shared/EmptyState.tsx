interface EmptyStateProps {
  icon?: string;
  message: string;
  sub?: string;
}

export function EmptyState({ icon = '📭', message, sub }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-3xl mb-3">{icon}</span>
      <p className="text-gray-400 font-medium">{message}</p>
      {sub && <p className="text-gray-600 text-sm mt-1">{sub}</p>}
    </div>
  );
}
