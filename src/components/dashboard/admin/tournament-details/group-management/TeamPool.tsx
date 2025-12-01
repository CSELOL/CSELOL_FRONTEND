import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import type { Team } from "@/api/teams";

interface TeamPoolProps {
  teams: Team[];
  orientation?: "vertical" | "horizontal";
}

export function TeamPool({ teams, orientation = "vertical" }: TeamPoolProps) {
  return (
    <div className={`space-y-2 ${orientation === "horizontal" ? "flex flex-col h-full" : ""}`}>
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
        Available Teams ({teams.length})
      </h3>
      <div
        className={
          orientation === "horizontal"
            ? "flex gap-2 overflow-x-auto pb-2 h-full items-center"
            : "space-y-2 max-h-[600px] overflow-y-auto pr-2"
        }
      >
        {teams.map((team) => (
          <DraggableTeam key={team.id} team={team} orientation={orientation} />
        ))}
        {teams.length === 0 && (
          <div className="text-zinc-500 text-sm italic p-4 border border-dashed border-white/10 rounded-lg text-center w-full">
            No teams available
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableTeam({ team, orientation }: { team: Team; orientation: "vertical" | "horizontal" }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `team-${team.id}`,
    data: { team, type: "team" },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 bg-zinc-900 border-white/10 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors
        ${orientation === "horizontal" ? "min-w-[200px] max-w-[200px]" : ""}
      `}
    >
      <GripVertical className="h-4 w-4 text-zinc-600 flex-shrink-0" />
      {team.logo_url && (
        <img
          src={team.logo_url}
          alt={team.tag}
          className="h-6 w-6 rounded object-cover bg-black flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate text-white">{team.name}</div>
        <div className="text-xs text-zinc-500 font-mono">{team.tag}</div>
      </div>
    </Card>
  );
}
