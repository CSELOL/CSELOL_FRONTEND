import { format } from "date-fns";
import { Edit, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminMatchListProps {
  matches: any[];
  onEditMatch: (match: any) => void;
}

export function AdminMatchList({ matches, onEditMatch }: AdminMatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-zinc-900/20">
        No matches found. Generate a schedule in the Groups or Playoffs tab
        first.
      </div>
    );
  }

  // Sort matches: Live > Scheduled > Completed, then by Date
  const sortedMatches = [...matches].sort((a, b) => {
    const statusOrder = { live: 0, scheduled: 1, completed: 2 };
    if (
      statusOrder[a.status as keyof typeof statusOrder] !==
      statusOrder[b.status as keyof typeof statusOrder]
    ) {
      return (
        statusOrder[a.status as keyof typeof statusOrder] -
        statusOrder[b.status as keyof typeof statusOrder]
      );
    }
    return (
      new Date(a.scheduledAt || 0).getTime() -
      new Date(b.scheduledAt || 0).getTime()
    );
  });

  return (
    <div className="space-y-4">
      {sortedMatches.map((match) => (
        <Card
          key={match.id}
          className={cn(
            "border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors cursor-pointer group",
            match.status === "live" && "border-red-500/30 bg-red-950/10"
          )}
          onClick={() => onEditMatch(match)}
        >
          <CardContent className="p-4 flex items-center gap-4">
            {/* Status Indicator */}
            <div className="w-24 shrink-0 flex flex-col gap-1">
              <Badge
                variant="outline"
                className={cn(
                  "w-fit justify-center border-none",
                  match.status === "live"
                    ? "bg-red-500/20 text-red-500"
                    : match.status === "completed"
                    ? "bg-zinc-800 text-zinc-500"
                    : "bg-blue-500/10 text-blue-400"
                )}
              >
                {match.status}
              </Badge>
              <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {match.scheduledAt
                  ? format(new Date(match.scheduledAt), "MMM dd HH:mm")
                  : "Unscheduled"}
              </div>
            </div>

            {/* Match Info */}
            <div className="flex-1 flex items-center justify-between gap-6">
              {/* Team A */}
              <div className="flex-1 text-right">
                <span
                  className={cn(
                    "font-bold text-sm",
                    match.winnerId === match.teamAId && "text-emerald-400"
                  )}
                >
                  {match.teamAName || "TBD"}
                </span>
              </div>

              {/* Scores */}
              <div className="flex items-center gap-3 font-mono text-lg font-bold bg-black/30 px-3 py-1 rounded border border-white/5">
                <span
                  className={
                    match.winnerId === match.teamAId
                      ? "text-emerald-400"
                      : "text-white"
                  }
                >
                  {match.scoreA}
                </span>
                <span className="text-zinc-600">:</span>
                <span
                  className={
                    match.winnerId === match.teamBId
                      ? "text-emerald-400"
                      : "text-white"
                  }
                >
                  {match.scoreB}
                </span>
              </div>

              {/* Team B */}
              <div className="flex-1 text-left">
                <span
                  className={cn(
                    "font-bold text-sm",
                    match.winnerId === match.teamBId && "text-emerald-400"
                  )}
                >
                  {match.teamBName || "TBD"}
                </span>
              </div>
            </div>

            {/* Context Info */}
            <div className="w-32 text-right hidden md:block">
              <div className="text-xs font-bold text-zinc-300 uppercase">
                {match.stage === "groups"
                  ? `Group ${match.group_name}`
                  : "Playoffs"}
              </div>
              <div className="text-[10px] text-zinc-500">
                {match.round_name || `Round ${match.round}`}
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4 text-zinc-400" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
