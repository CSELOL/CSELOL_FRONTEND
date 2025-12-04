import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GroupStageBracketProps {
  groups: string[]; // ["A", "B"]
  matches: any[];
  teams: any[];
  onMatchClick?: (match: any) => void;
  isAdmin?: boolean;
}

export function GroupStageBracket({
  groups,
  matches,
  teams,
  onMatchClick,
  isAdmin = false,
}: GroupStageBracketProps) {
  const [activeGroup, setActiveGroup] = useState(groups[0] || "A");

  // 1. Filter matches for the active group
  const groupMatches = useMemo(() => {
    return matches
      .filter((m) => m.group_name === activeGroup)
      .sort((a, b) => {
        // Sort by Round, then Match Index
        if (a.round !== b.round) return a.round - b.round;
        return a.matchIndex - b.matchIndex;
      });
  }, [matches, activeGroup]);

  // 2. Identify unique rounds
  const rounds = useMemo(() => {
    return Array.from(new Set(groupMatches.map((m) => m.round))).sort(
      (a, b) => a - b
    );
  }, [groupMatches]);

  // 3. Calculate Standings on the fly based on filtered matches
  const groupStandings = useMemo(() => {
    const stats: Record<string, any> = {};

    // Init stats for teams found in matches or passed in teams list
    // Ideally we filter 'teams' to only those in this group, but deriving from matches is safer for consistency
    groupMatches.forEach((m) => {
      [m.teamAId, m.teamBId].forEach((tid) => {
        if (tid && !stats[tid]) {
          const t = teams.find((team) => team.id === tid);
          stats[tid] = {
            id: tid,
            name: t?.name || "Unknown",
            logo_url: t?.logo_url,
            wins: 0,
            losses: 0,
            points: 0,
            history: [],
          };
        }
      });
    });

    groupMatches.forEach((m) => {
      if (m.status !== "completed") return;
      if (m.winnerId) {
        if (stats[m.winnerId]) {
          stats[m.winnerId].wins++;
          stats[m.winnerId].points += 3; // 3 pts for win
          stats[m.winnerId].history.push("W");
        }
        const loserId = m.winnerId === m.teamAId ? m.teamBId : m.teamAId;
        if (stats[loserId]) {
          stats[loserId].losses++;
          stats[loserId].history.push("L");
        }
      }
    });

    return Object.values(stats).sort((a: any, b: any) => {
      if (a.points !== b.points) return b.points - a.points;
      return b.wins - a.wins;
    });
  }, [groupMatches, teams]);

  return (
    <div className="space-y-6">
      {/* Group Tabs */}
      {groups.length > 0 && (
        <Tabs
          value={activeGroup}
          onValueChange={setActiveGroup}
          className="w-full"
        >
          <TabsList className="bg-zinc-900 border border-white/10 w-full justify-start overflow-x-auto h-12">
            {groups.map((g) => (
              <TabsTrigger key={g} value={g} className="px-6 h-10">
                Group {g}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- LEFT CARD: STANDINGS --- */}
        <Card className="bg-zinc-900/40 border-white/10 h-fit">
          <CardHeader className="pb-2 border-b border-white/5">
            <CardTitle className="text-sm font-bold uppercase text-zinc-400">
              Standings - Group {activeGroup}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-12 text-center text-[10px] uppercase font-bold text-zinc-500">
                    Rank
                  </TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                    Team
                  </TableHead>
                  <TableHead className="text-center text-[10px] uppercase font-bold text-zinc-500">
                    W - L
                  </TableHead>
                  <TableHead className="text-center text-[10px] uppercase font-bold text-primary">
                    Pts
                  </TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold text-zinc-500 pr-4">
                    Form
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupStandings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-zinc-500"
                    >
                      No teams found.
                    </TableCell>
                  </TableRow>
                ) : (
                  groupStandings.map((team: any, index: number) => (
                    <TableRow
                      key={team.id}
                      className="border-white/5 hover:bg-white/5"
                    >
                      <TableCell className="text-center font-mono text-zinc-400">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {team.logo_url ? (
                            <img
                              src={team.logo_url}
                              className="w-6 h-6 rounded object-cover bg-black"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                              {team.name[0]}
                            </div>
                          )}
                          <span className="font-bold text-sm text-white truncate max-w-[120px]">
                            {team.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-zinc-300">
                        {team.wins} - {team.losses}
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary">
                        {team.points}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex justify-end gap-1">
                          {team.history
                            .slice(-3)
                            .map((res: string, i: number) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold",
                                  res === "W"
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                                )}
                              >
                                {res}
                              </div>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* --- RIGHT CARD: MATCHES (Grouped by Round) --- */}
        <Card className="bg-zinc-900/40 border-white/10 flex flex-col max-h-[800px]">
          <CardHeader className="pb-2 border-b border-white/5">
            <CardTitle className="text-sm font-bold uppercase text-zinc-400">
              Match Schedule
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="p-4 space-y-6">
              {rounds.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">
                  No matches generated yet.
                </div>
              ) : (
                rounds.map((round) => {
                  const roundMatches = groupMatches.filter(
                    (m) => m.round === round
                  );
                  return (
                    <div key={round} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-white/10 text-zinc-400 bg-black/40"
                        >
                          Round {round}
                        </Badge>
                        <div className="h-px bg-white/5 flex-1" />
                      </div>

                      <div className="grid gap-2">
                        {roundMatches.map((match) => (
                          <div
                            key={match.id}
                            onClick={() => isAdmin && onMatchClick?.(match)}
                            className={cn(
                              "relative flex items-center justify-between p-3 rounded-lg border bg-zinc-900/60 transition-all",
                              match.status === "live"
                                ? "border-red-500/30 bg-red-950/10"
                                : "border-white/5 hover:border-white/10",
                              isAdmin ? "cursor-pointer hover:bg-white/5" : ""
                            )}
                          >
                            {/* Date */}
                            <div className="text-[10px] text-zinc-500 w-16 text-center leading-tight">
                              {match.scheduledAt
                                ? format(
                                    new Date(match.scheduledAt),
                                    "MMM dd HH:mm"
                                  )
                                : "TBD"}
                              {match.status === "live" && (
                                <div className="text-red-500 font-bold animate-pulse mt-0.5">
                                  LIVE
                                </div>
                              )}
                            </div>

                            {/* Teams Row */}
                            <div className="flex-1 flex items-center justify-center gap-3">
                              {/* Team A */}
                              <div className="flex-1 text-right flex items-center justify-end gap-2">
                                <span
                                  className={cn(
                                    "text-xs font-bold truncate",
                                    match.winnerId === match.teamAId
                                      ? "text-primary"
                                      : "text-white"
                                  )}
                                >
                                  {match.teamAName || "TBD"}
                                </span>
                              </div>

                              {/* Score */}
                              <div className="px-2 py-0.5 bg-black/40 rounded border border-white/5 font-mono text-xs font-bold text-white min-w-[40px] text-center">
                                {match.status === "scheduled"
                                  ? "vs"
                                  : `${match.scoreA} : ${match.scoreB}`}
                              </div>

                              {/* Team B */}
                              <div className="flex-1 text-left flex items-center justify-start gap-2">
                                <span
                                  className={cn(
                                    "text-xs font-bold truncate",
                                    match.winnerId === match.teamBId
                                      ? "text-primary"
                                      : "text-white"
                                  )}
                                >
                                  {match.teamBName || "TBD"}
                                </span>
                              </div>
                            </div>

                            {/* Icons */}
                            <div className="w-6 flex justify-end">
                              {match.metadata?.notes && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-3 w-3 text-yellow-500" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-950 border-white/10 text-white max-w-xs">
                                      <p className="text-xs">
                                        {match.metadata.notes}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {isAdmin && (
                                <Edit2 className="h-3 w-3 text-zinc-600 ml-1" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
