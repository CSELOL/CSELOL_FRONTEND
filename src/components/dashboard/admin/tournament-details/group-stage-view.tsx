import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Calendar, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupStageViewProps {
  groups: string[]; // ['A', 'B']
  matches: any[]; // All matches
  standings: any[]; // All standings data
  onMatchClick: (match: any) => void;
}

export function GroupStageView({
  groups,
  matches,
  standings,
  onMatchClick,
}: GroupStageViewProps) {
  const [activeGroup, setActiveGroup] = useState(groups[0] || "A");

  const groupMatches = matches.filter((m) => m.group_name === activeGroup);
  const groupStandings = standings
    .filter((s) => s.group_name === activeGroup)
    .sort((a, b) => b.points - a.points || b.wins - a.wins);

  return (
    <div className="space-y-6">
      {/* Group Selector */}
      <Tabs
        value={activeGroup}
        onValueChange={setActiveGroup}
        className="w-full"
      >
        <TabsList className="bg-zinc-900 border-white/10">
          {groups.map((g) => (
            <TabsTrigger key={g} value={g} className="px-8">
              Group {g}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid md:grid-cols-5 gap-6">
        {/* LEFT: Standings Table (2 Cols) */}
        <Card className="md:col-span-2 bg-zinc-900/30 border-white/10 h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">
              Standings - Group {activeGroup}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">W-L</TableHead>
                  <TableHead className="text-right pr-4">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupStandings.map((team, idx) => (
                  <TableRow key={team.id} className="border-white/5">
                    <TableCell className="font-mono text-zinc-500">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-bold text-white">
                      {team.name}
                    </TableCell>
                    <TableCell className="text-center text-zinc-300">
                      {team.wins}-{team.losses}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary pr-4">
                      {team.points}
                    </TableCell>
                  </TableRow>
                ))}
                {groupStandings.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-zinc-500 h-24"
                    >
                      No standings data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* RIGHT: Match List (3 Cols) */}
        <Card className="md:col-span-3 bg-zinc-900/30 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {groupMatches.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                No matches generated for this group.
              </div>
            ) : (
              groupMatches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => onMatchClick(match)}
                  className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-primary/50 cursor-pointer transition-all group"
                >
                  <div className="flex flex-col min-w-[80px]">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      {match.scheduledAt
                        ? new Date(match.scheduledAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" }
                          )
                        : "TBD"}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase mt-1">
                      BO{match.bestOf}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center gap-4">
                    <div
                      className={cn(
                        "text-right flex-1 font-bold",
                        match.winnerId === match.teamAId
                          ? "text-primary"
                          : "text-white"
                      )}
                    >
                      {match.teamAName || "TBD"}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded text-sm font-mono font-bold border border-white/10">
                      <span
                        className={
                          match.scoreA > match.scoreB
                            ? "text-white"
                            : "text-zinc-500"
                        }
                      >
                        {match.scoreA}
                      </span>
                      <span className="text-zinc-700">:</span>
                      <span
                        className={
                          match.scoreB > match.scoreA
                            ? "text-white"
                            : "text-zinc-500"
                        }
                      >
                        {match.scoreB}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "text-left flex-1 font-bold",
                        match.winnerId === match.teamBId
                          ? "text-primary"
                          : "text-white"
                      )}
                    >
                      {match.teamBName || "TBD"}
                    </div>
                  </div>

                  <div className="w-8 flex justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
