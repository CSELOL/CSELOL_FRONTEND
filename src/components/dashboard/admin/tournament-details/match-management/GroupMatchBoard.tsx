import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Edit2, Clock, Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Match {
  id: number;
  round: number;
  matchIndex: number;
  group_name: string;
  teamAName: string;
  teamBName: string;
  teamAId: number;
  teamBId: number;
  scoreA: number;
  scoreB: number;
  winnerId: number | null;
  status: string;
  scheduledAt: string | null;
}

interface GroupMatchBoardProps {
  matches: Match[];
  onMatchClick: (match: Match) => void;
}

export function GroupMatchBoard({
  matches,
  onMatchClick,
}: GroupMatchBoardProps) {
  // Get unique group names
  const groups = useMemo(() => {
    const s = new Set(matches.map((m) => m.group_name));
    return Array.from(s).sort();
  }, [matches]);

  const [activeGroup, setActiveGroup] = useState(groups[0] || "A");

  // Filter matches for the active group
  const groupMatches = useMemo(() => {
    return matches.filter((m) => m.group_name === activeGroup);
  }, [matches, activeGroup]);

  // Group matches by Round
  const rounds = useMemo(() => {
    const roundMap = new Map<number, Match[]>();
    groupMatches.forEach((m) => {
      if (!roundMap.has(m.round)) roundMap.set(m.round, []);
      roundMap.get(m.round)?.push(m);
    });
    // Sort rounds
    return Array.from(roundMap.entries()).sort((a, b) => a[0] - b[0]);
  }, [groupMatches]);

  if (groups.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-zinc-900/20">
        No matches found. Generate the schedule in the "Groups" setup tab first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Group Selector */}
      <div className="flex items-center gap-4">
        <Tabs
          value={activeGroup}
          onValueChange={setActiveGroup}
          className="w-full"
        >
          <TabsList className="bg-zinc-900 border border-white/10 h-10 p-1 w-full justify-start overflow-x-auto">
            {groups.map((g) => (
              <TabsTrigger key={g} value={g} className="px-6 text-xs font-bold">
                Group {g}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Board Layout (Horizontal Scroll for Rounds) */}
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-white/5 bg-zinc-900/20">
        <div className="flex space-x-4 p-4">
          {rounds.map(([roundNum, roundMatches]) => (
            <div key={roundNum} className="w-[280px] shrink-0 space-y-3">
              {/* Round Header */}
              <div className="flex items-center justify-between px-2 bg-white/5 py-1.5 rounded border border-white/5">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Round {roundNum}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">
                  {roundMatches.length} Matches
                </span>
              </div>

              {/* Matches List */}
              <div className="space-y-2">
                {roundMatches
                  .sort((a, b) => a.matchIndex - b.matchIndex)
                  .map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => onMatchClick(match)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

// --- Compact Match Card ---
function MatchCard({ match, onClick }: { match: Match; onClick: () => void }) {
  const isCompleted = match.status === "completed";
  const isLive = match.status === "live";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col gap-0.5 p-0 rounded overflow-hidden border transition-all cursor-pointer group hover:shadow-lg",
        isLive
          ? "border-red-500/40 bg-red-950/10"
          : "border-white/10 bg-zinc-900 hover:border-primary/40 hover:bg-zinc-800"
      )}
    >
      {/* Top Bar: Status */}
      <div className="flex items-center justify-between px-2 py-1 bg-black/20 text-[9px] text-zinc-500 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono">#{match.id}</span>
          {match.scheduledAt && (
            <span className="text-zinc-400">
              {format(new Date(match.scheduledAt), "HH:mm")}
            </span>
          )}
        </div>
        {isLive && (
          <span className="text-red-500 font-bold animate-pulse">LIVE</span>
        )}
      </div>

      {/* Team A Row */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-1.5",
          match.winnerId === match.teamAId ? "bg-primary/5" : ""
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span
            className={cn(
              "text-xs font-bold truncate",
              match.winnerId === match.teamAId
                ? "text-primary"
                : "text-zinc-300"
            )}
          >
            {match.teamAName || "TBD"}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-mono font-bold",
            match.winnerId === match.teamAId ? "text-primary" : "text-zinc-500"
          )}
        >
          {isCompleted || isLive ? match.scoreA : "-"}
        </span>
      </div>

      {/* Team B Row */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-1.5 border-t border-white/5",
          match.winnerId === match.teamBId ? "bg-primary/5" : ""
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span
            className={cn(
              "text-xs font-bold truncate",
              match.winnerId === match.teamBId
                ? "text-primary"
                : "text-zinc-300"
            )}
          >
            {match.teamBName || "TBD"}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-mono font-bold",
            match.winnerId === match.teamBId ? "text-primary" : "text-zinc-500"
          )}
        >
          {isCompleted || isLive ? match.scoreB : "-"}
        </span>
      </div>
    </div>
  );
}
