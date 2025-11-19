// src/components/tournament/group-stage.tsx
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mock Data for the table
const standings = [
  {
    rank: 1,
    team: "Sergipe Slayers",
    tag: "SLY",
    played: 14,
    w: 12,
    l: 2,
    pts: 36,
    diff: "+15",
    trend: "up",
  },
  {
    rank: 2,
    team: "Aracaju Void",
    tag: "AJU",
    played: 14,
    w: 10,
    l: 4,
    pts: 30,
    diff: "+8",
    trend: "same",
  },
  {
    rank: 3,
    team: "Itabaiana Saints",
    tag: "ITA",
    played: 14,
    w: 9,
    l: 5,
    pts: 27,
    diff: "+5",
    trend: "up",
  },
  {
    rank: 4,
    team: "Estância Eagles",
    tag: "EST",
    played: 14,
    w: 8,
    l: 6,
    pts: 24,
    diff: "+2",
    trend: "down",
  },
  {
    rank: 5,
    team: "Lagarto Kings",
    tag: "LGT",
    played: 14,
    w: 6,
    l: 8,
    pts: 18,
    diff: "-4",
    trend: "down",
  },
  {
    rank: 6,
    team: "Propriá Punks",
    tag: "PRP",
    played: 14,
    w: 5,
    l: 9,
    pts: 15,
    diff: "-6",
    trend: "same",
  },
  {
    rank: 7,
    team: "Socorro Spirits",
    tag: "SOC",
    played: 14,
    w: 3,
    l: 11,
    pts: 9,
    diff: "-12",
    trend: "down",
  },
  {
    rank: 8,
    team: "Barra Bulls",
    tag: "BAR",
    played: 14,
    w: 3,
    l: 11,
    pts: 9,
    diff: "-13",
    trend: "up",
  },
];

export function GroupStage() {
  return (
    <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="w-[80px] text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              Rank
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Team
            </TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              Played
            </TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              W - L
            </TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              +/-
            </TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-primary">
              Points
            </TableHead>
            <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              Trend
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((row, index) => {
            // Top 4 get a subtle highlight indicating "Qualified"
            const isQualified = index < 4;

            return (
              <TableRow
                key={row.tag}
                className="border-white/5 hover:bg-white/5 transition-colors group"
              >
                {/* Rank */}
                <TableCell className="text-center font-mono font-medium text-zinc-400">
                  {row.rank}
                </TableCell>

                {/* Team */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-500 group-hover:bg-primary group-hover:text-background transition-colors">
                      {row.tag.substring(0, 1)}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-bold text-sm",
                          isQualified ? "text-white" : "text-zinc-400"
                        )}
                      >
                        {row.team}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {row.tag}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Stats */}
                <TableCell className="text-center text-zinc-400">
                  {row.played}
                </TableCell>
                <TableCell className="text-center font-mono text-white">
                  <span className="text-emerald-500">{row.w}</span> -{" "}
                  <span className="text-red-500">{row.l}</span>
                </TableCell>
                <TableCell className="text-center text-zinc-500 text-xs">
                  {row.diff}
                </TableCell>
                <TableCell className="text-center font-bold text-primary text-lg">
                  {row.pts}
                </TableCell>

                {/* Trend */}
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {row.trend === "up" && (
                      <ArrowUp className="h-4 w-4 text-emerald-500" />
                    )}
                    {row.trend === "down" && (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    {row.trend === "same" && (
                      <Minus className="h-4 w-4 text-zinc-600" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-white/5 bg-white/5 px-4 py-2 text-[10px] text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          <span>Playoffs Qualification (Top 4)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-zinc-800 border border-zinc-700" />
          <span>Elimination</span>
        </div>
      </div>
    </div>
  );
}
