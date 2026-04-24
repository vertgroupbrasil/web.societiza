import { Avatar, AvatarFallback, AvatarImage, Button, Badge } from '@shadcn/index';
import { Trash2 } from 'lucide-react';
import type { Member } from '../../schemas/office.schema';

interface MemberCardProps {
  member: Member;
  isCurrentUser?: boolean;
  canRemove?: boolean;
  onRemove?: (memberId: string) => void;
  isRemoving?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function MemberCard({
  member,
  isCurrentUser = false,
  canRemove = false,
  onRemove,
  isRemoving = false,
}: MemberCardProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={member.avatarUrl ?? undefined} alt={member.name} />
          <AvatarFallback className="text-xs font-medium">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium leading-none">
              {member.name}
              {isCurrentUser && (
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  (você)
                </span>
              )}
            </span>
            {member.role === 'Owner' && (
              <Badge variant="secondary" className="text-xs py-0 px-1.5">
                Owner
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground mt-0.5">
            {member.email}
          </span>
        </div>
      </div>

      {canRemove && member.role !== 'Owner' && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove?.(member.id)}
          disabled={isRemoving}
          aria-label={`Remover ${member.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
