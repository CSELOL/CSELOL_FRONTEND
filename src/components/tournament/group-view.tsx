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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit2, Info, CheckCircle2, XCircle, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GroupViewProps {
  groups: string[]; // ["A", "B"]
  matches: any[];
  teams: any[];
  onMatchClick?: (match: any) => void;
  isAdmin?: boolean;
}

export function GroupView({
  groups,
  matches,
  teams,
  onMatchClick,
  isAdmin,
}: GroupViewProps) {
  const [activeGroup, setActiveGroup] = useState(groups[0] || "A");

  // Filter matches for current group
  const groupMatches = useMemo(() => {
    return matches
      .filter((m) => m.group_name === activeGroup)
      .sort((a, b) => {
        // Sort by Round, then Match Index
        if (a.round !== b.round) return a.round - b.round;
        return a.matchIndex - b.matchIndex;
      });
  }, [matches, activeGroup]);

  // Calculate Comprehensive Standings
  const groupStandings = useMemo(() => {
    const stats: Record<string, any> = {};

    // 1. Initialize stats for all teams found in this group's matches
    groupMatches.forEach((m) => {
      [m.teamAId, m.teamBId].forEach((tid) => {
        if (tid && !stats[tid]) {
          const t = teams.find((team) => team.id === tid);
          stats[tid] = {
            id: tid,
            name: t?.name || "Unknown",
            tag: t?.tag || "UNK",
            logo_url: t?.logo_url,
            matchWins: 0,
            matchLosses: 0,
            matchTies: 0,
            setWins: 0, // Individual games won (1-0, 2-1)
            setLosses: 0,
            points: 0,
            history: [], // ['W', 'L', 'W']
          };
        }
      });
    });

    // 2. Process Matches
    groupMatches.forEach((m) => {
      if (m.status !== "completed") return;
      if (!m.teamAId || !m.teamBId) return;

      const teamA = stats[m.teamAId];
      const teamB = stats[m.teamBId];

      if (!teamA || !teamB) return;

      // Update Sets (Game Score)
      teamA.setWins += m.scoreA;
      teamA.setLosses += m.scoreB;
      teamB.setWins += m.scoreB;
      teamB.setLosses += m.scoreA;

      // Update Match Result (Series)
      if (m.winnerId === m.teamAId) {
        teamA.matchWins++;
        teamA.points += 3; // Standard: 3pts for series win
        teamA.history.push("W");

        teamB.matchLosses++;
        teamB.history.push("L");
      } else if (m.winnerId === m.teamBId) {
        teamB.matchWins++;
        teamB.points += 3;
        teamB.history.push("W");

        teamA.matchLosses++;
        teamA.history.push("L");
      } else {
        // Tie (rare in brackets, possible in BO2)
        teamA.matchTies++;
        teamA.points += 1;
        teamA.history.push("T");

        teamB.matchTies++;
        teamB.points += 1;
        teamB.history.push("T");
      }
    });

    // 3. Convert to Array & Sort
    return Object.values(stats).sort((a: any, b: any) => {
      if (a.points !== b.points) return b.points - a.points; // Points
      if (a.matchWins !== b.matchWins) return b.matchWins - a.matchWins; // Wins
      return b.setWins - b.setLosses - (a.setWins - a.setLosses); // Set Diff
    });
  }, [groupMatches, teams]);

  return (
    <div className="space-y-6">
      {/* 1. Group Selector Tabs */}
      <Tabs
        value={activeGroup}
        onValueChange={setActiveGroup}
        className="w-full"
      >
        <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent p-0 h-auto">
          {groups.map((g) => (
            <TabsTrigger
              key={g}
              value={g}
              className="relative rounded-none border-b-2 border-transparent px-6 pb-3 pt-2 font-medium text-zinc-400 hover:text-white data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent"
            >
              Group {g}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 2. Group Content (Standings vs Matches) */}
      <Tabs defaultValue="standings" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-zinc-900 border border-white/10">
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
          </TabsList>
          {isAdmin && (
            <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider mr-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />{" "}
              Admin Mode
            </span>
          )}
        </div>

        {/* --- TAB: STANDINGS --- */}
        <TabsContent value="standings">
          <Card className="bg-zinc-900/40 border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-12 text-center text-xs font-bold text-zinc-500 uppercase">
                    Rank
                  </TableHead>
                  <TableHead className="text-xs font-bold text-zinc-500 uppercase">
                    Participant
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-zinc-500 uppercase">
                    Match
                    <br />
                    <span className="text-[10px]">W - L - T</span>
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-zinc-500 uppercase">
                    Set
                    <br />
                    <span className="text-[10px]">W - L</span>
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-primary uppercase">
                    Pts
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold text-zinc-500 uppercase pr-6">
                    Form
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupStandings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-zinc-500"
                    >
                      No teams in this group yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  groupStandings.map((team: any, index: number) => (
                    <TableRow
                      key={team.id}
                      className="border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="text-center font-mono text-zinc-400">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {team.logo_url ? (
                            <img
                              src={team.logo_url}
                              className="w-8 h-8 rounded bg-black object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                              {team.tag?.[0]}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">
                              {team.name}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {team.tag}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-zinc-300">
                        {team.matchWins} - {team.matchLosses} - {team.matchTies}
                      </TableCell>
                      <TableCell className="text-center font-mono text-zinc-400 text-xs">
                        {team.setWins} - {team.setLosses}
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary text-base">
                        {team.points}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          {team.history
                            .slice(-5)
                            .map((res: string, i: number) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border border-white/5",
                                  res === "W"
                                    ? "bg-emerald-500/20 text-emerald-500"
                                    : res === "L"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-zinc-700 text-zinc-400"
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
          </Card>
        </TabsContent>

        {/* --- TAB: MATCHES --- */}
        <TabsContent value="matches">
          <div className="space-y-4">
            {groupMatches.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-zinc-900/20">
                Matches have not been generated for this group yet.
              </div>
            ) : (
              groupMatches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => isAdmin && onMatchClick?.(match)}
                  className={cn(
                    "flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg border bg-zinc-900/40 transition-all",
                    match.status === "live"
                      ? "border-red-500/30 bg-red-950/10"
                      : "border-white/5 hover:border-white/10",
                    isAdmin ? "cursor-pointer hover:bg-white/5" : ""
                  )}
                >
                  {/* Time */}
                  <div className="w-full md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-1 text-xs text-zinc-500">
                    <span className="font-bold text-zinc-400 uppercase">
                      {match.round_name || `Round ${match.round}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>
                        {match.scheduledAt
                          ? format(new Date(match.scheduledAt), "MMM dd, HH:mm")
                          : "TBD"}
                      </span>
                      {match.status === "live" && (
                        <Badge
                          variant="destructive"
                          className="h-4 px-1 text-[10px]"
                        >
                          LIVE
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Matchup */}
                  <div className="flex-1 flex items-center justify-between w-full md:w-auto">
                    <div className="flex-1 flex items-center justify-end gap-3 text-right">
                      <span
                        className={cn(
                          "font-bold text-sm",
                          match.winnerId === match.teamAId
                            ? "text-primary"
                            : "text-white"
                        )}
                      >
                        {match.teamAName}
                      </span>
                      {/* Placeholder Logo if needed */}
                    </div>

                    <div className="px-4 flex flex-col items-center min-w-[80px]">
                      {match.status === "completed" ||
                      match.status === "live" ? (
                        <div className="text-xl font-mono font-bold text-white tracking-widest bg-black/40 px-3 py-1 rounded border border-white/10">
                          {match.scoreA} : {match.scoreB}
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-bold text-xs">
                          VS
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-600 mt-1 uppercase">
                        BO{match.bestOf}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center justify-start gap-3 text-left">
                      <span
                        className={cn(
                          "font-bold text-sm",
                          match.winnerId === match.teamBId
                            ? "text-primary"
                            : "text-white"
                        )}
                      >
                        {match.teamBName}
                      </span>
                    </div>
                  </div>

                  {/* Metadata / Actions */}
                  <div className="w-full md:w-10 flex justify-end">
                    {match.metadata?.notes && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-yellow-500" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-950 border-white/10 text-white max-w-xs">
                            <p className="text-xs">{match.metadata.notes}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {isAdmin && (
                      <Edit2 className="h-4 w-4 text-zinc-600 ml-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
