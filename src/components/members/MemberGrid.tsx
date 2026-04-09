import type { MemberDetail } from '../../types/it.types';
import { MemberCard } from './MemberCard';
import { EmptyState } from '../shared/EmptyState';

interface MemberGridProps {
  members: MemberDetail[];
  query?: string;
  onSelect: (member: MemberDetail) => void;
}

export function MemberGrid({ members, query = '', onSelect }: MemberGridProps) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        message={`Không tìm thấy "${query}"`}
        sub="Thử tên khác"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {members.map(m => (
        <MemberCard
          key={m.id}
          member={m}
          query={query}
          onClick={() => onSelect(m)}
        />
      ))}
    </div>
  );
}
