import { format } from "date-fns";
import { Calendar, Swords } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Match {
  id: number;
  teamAName: string;
  teamBName: string;
  teamAId: number;
  teamBId: number;
  scoreA: number;
  scoreB: number;
  winnerId: number | null;
  status: string;
  scheduledAt: string;
  round: number;
  round_name?: string;
}

interface MatchListProps {
  matches: Match[];
}

export function MatchList({ matches }: MatchListProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl">
        No matches scheduled yet.
      </div>
    );
  }

  // Group matches by date
  const groupedMatches = matches.reduce((acc, match) => {
    const date = match.scheduledAt
      ? format(new Date(match.scheduledAt), "yyyy-MM-dd")
      : "TBD";
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
    if (a === "TBD") return 1;
    if (b === "TBD") return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            {date === "TBD"
              ? "To Be Determined"
              : format(new Date(date), "EEEE, MMMM do, yyyy")}
          </h3>
          <div className="grid gap-3">
            {groupedMatches[date].map((match) => (
              <Card
                key={match.id}
                className="bg-zinc-900/30 border-white/5 hover:bg-zinc-900/50 transition-colors"
              >
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center w-16 shrink-0">
                      <span className="block text-xs text-zinc-500 font-mono">
                        {match.scheduledAt
                          ? format(new Date(match.scheduledAt), "HH:mm")
                          : "--:--"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between flex-1 gap-4">
                      {/* Team A */}
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span
                          className={`font-bold text-right truncate ${
                            match.winnerId === match.teamAId
                              ? "text-primary"
                              : "text-white"
                          }`}
                        >
                          {match.teamAName || "TBD"}
                        </span>
                      </div>

                      {/* Score / VS */}
                      <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-lg min-w-[80px] justify-center">
                        {match.status === "COMPLETED" ? (
                          <>
                            <span className={`font-mono font-bold ${match.winnerId === match.teamAId ? "text-primary" : "text-zinc-400"}`}>{match.scoreA}</span>
                            <span className="text-zinc-600 text-xs">-</span>
                            <span className={`font-mono font-bold ${match.winnerId === match.teamBId ? "text-primary" : "text-zinc-400"}`}>{match.scoreB}</span>
                          </>
                        ) : (
                          <span className="text-zinc-500 text-xs font-bold">VS</span>
                        )}
                      </div>

                      {/* Team B */}
                      <div className="flex items-center gap-3 flex-1 justify-start">
                        <span
                          className={`font-bold text-left truncate ${
                            match.winnerId === match.teamBId
                              ? "text-primary"
                              : "text-white"
                          }`}
                        >
                          {match.teamBName || "TBD"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                      {match.round_name || `Round ${match.round}`}
                    </div>
                    <Badge
                      variant="outline"
                      className={`border-white/10 ${
                        match.status === "COMPLETED"
                          ? "text-zinc-500"
                          : match.status === "LIVE"
                          ? "text-red-500 border-red-500/20 bg-red-500/10 animate-pulse"
                          : "text-primary"
                      }`}
                    >
                      {match.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
