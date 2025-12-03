import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Team } from "@/api/teams";

interface GroupBucketProps {
  id: string;
  name: string;
  teams: Team[];
  onRemoveTeam: (teamId: number) => void;
}

export function GroupBucket({ id, name, teams, onRemoveTeam }: GroupBucketProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { type: "group", groupName: name },
  });

  return (
    <Card
      ref={setNodeRef}
      className={`p-4 border-white/10 flex flex-col h-full min-h-[200px] transition-colors ${
        isOver ? "bg-primary/10 border-primary/50" : "bg-zinc-900/50"
      }`}
    >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="font-bold text-white">{name}</h3>
        <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-zinc-400">
          {teams.length} Teams
        </span>
      </div>

      <div className="space-y-2 flex-1">
        {teams.map((team) => (
          <DraggableGroupTeam 
            key={team.id} 
            team={team} 
            onRemove={() => onRemoveTeam(team.id)} 
          />
        ))}
        {teams.length === 0 && (
          <div className="h-20 flex items-center justify-center text-zinc-600 text-xs border border-dashed border-white/5 rounded">
            Drop teams here
          </div>
        )}
      </div>
    </Card>
  );
}

function DraggableGroupTeam({ team, onRemove }: { team: Team; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `group-team-${team.id}`, // Unique ID distinct from pool
    data: { team, type: "group-team" },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-2 rounded bg-black/40 border border-white/5 group cursor-grab active:cursor-grabbing hover:border-primary/30"
    >
      <GripVertical className="h-3 w-3 text-zinc-700" />
      {team.logo_url && (
        <img
          src={team.logo_url}
          alt={team.tag}
          className="h-6 w-6 rounded object-cover bg-zinc-800"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-zinc-300 truncate">
          {team.name}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on button click
        onClick={(e) => {
            e.stopPropagation();
            onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
