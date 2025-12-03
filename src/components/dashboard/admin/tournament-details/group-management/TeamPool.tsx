import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import type { Team } from "@/api/teams";

interface TeamPoolProps {
  teams: Team[];
  orientation?: "vertical" | "horizontal";
}

export function TeamPool({ teams, orientation = "vertical" }: TeamPoolProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "team-pool",
    data: { type: "pool" },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`space-y-2 h-full flex flex-col transition-colors rounded-lg ${
        isOver ? "bg-primary/5 border-primary/20" : ""
      } ${orientation === "horizontal" ? "flex flex-col h-full" : ""}`}
    >
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">
        Available Teams ({teams.length})
      </h3>
      <div
        className={
          orientation === "horizontal"
            ? "flex gap-2 overflow-x-auto pb-2 h-full items-center"
            : "space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar"
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
    id: `pool-team-${team.id}`, // Unique ID for pool items
    data: { team, type: "pool-team" },
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
      className={`
        flex items-center gap-2 p-2 rounded bg-zinc-900 border border-white/5 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors
        ${orientation === "horizontal" ? "min-w-[150px] max-w-[150px]" : ""}
      `}
    >
      <GripVertical className="h-3 w-3 text-zinc-600 flex-shrink-0" />
      {team.logo_url && (
        <img
          src={team.logo_url}
          alt={team.tag}
          className="h-5 w-5 rounded object-cover bg-black flex-shrink-0"
        />
      )}
      <span className="font-bold text-sm truncate text-zinc-300 flex-1">{team.name}</span>
    </div>
  );
}
