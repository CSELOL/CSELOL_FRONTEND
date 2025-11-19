import { Play, Calendar, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data - In the future, this comes from your backend/Supabase
const matches = [
  {
    id: 1,
    status: "LIVE",
    teamA: "Sergipe Slayers",
    teamB: "Aracaju Void",
    scoreA: 1,
    scoreB: 0,
    time: "Running",
    date: "Today",
  },
  {
    id: 2,
    status: "UPCOMING",
    teamA: "Lagarto Kings",
    teamB: "Itabaiana Saints",
    scoreA: 0,
    scoreB: 0,
    time: "19:00",
    date: "Today",
  },
  {
    id: 3,
    status: "UPCOMING",
    teamA: "Propriá Punks",
    teamB: "Estância Eagles",
    scoreA: 0,
    scoreB: 0,
    time: "20:00",
    date: "Today",
  },
  {
    id: 4,
    status: "FINISHED",
    teamA: "Socorro Spirits",
    teamB: "Barra Bulls",
    scoreA: 2,
    scoreB: 1,
    time: "Yesterday",
    date: "14 May",
  },
];

export function MatchesSection() {
  return (
    <section className="w-full border-t border-white/5 bg-background py-24">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Match Schedule
            </h2>
            <p className="mt-1 text-zinc-400">
              Follow the action in real-time.
            </p>
          </div>

          {/* Tech-style Tabs */}
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50 p-1 text-zinc-400 md:w-[300px]">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="live"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400"
              >
                Live
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-blue-400"
              >
                Upcoming
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Matches Grid */}
        <div className="grid gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-lg border border-white/5 bg-card/30 p-4 transition-all hover:border-primary/20 hover:bg-card/50 md:flex-row md:px-8"
            >
              {/* Left: Date/Time */}
              <div className="flex w-full items-center justify-between gap-4 md:w-auto md:flex-col md:items-start md:justify-center md:gap-1">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <Calendar className="h-3 w-3" />
                  {match.date}
                </div>
                <div className="flex items-center gap-2 font-mono text-lg font-semibold text-white">
                  <Clock className="h-4 w-4 text-primary" />
                  {match.time}
                </div>
              </div>

              {/* Divider (Mobile hidden) */}
              <div className="hidden h-10 w-px bg-white/5 md:block mx-4" />

              {/* Center: Teams & VS */}
              <div className="flex flex-1 w-full flex-row items-center justify-between gap-4 md:justify-start">
                {/* Team A */}
                <div className="flex flex-1 items-center justify-end gap-3 text-right">
                  <span className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {match.teamA}
                  </span>
                  <div className="h-8 w-8 rounded bg-zinc-800/50 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-600">
                    {match.teamA.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* VS / Score */}
                <div className="flex w-20 flex-col items-center justify-center">
                  {match.status === "LIVE" || match.status === "FINISHED" ? (
                    <div className="flex items-center gap-2 text-2xl font-black tracking-widest text-white">
                      <span
                        className={
                          match.scoreA > match.scoreB
                            ? "text-primary"
                            : "text-white"
                        }
                      >
                        {match.scoreA}
                      </span>
                      <span className="text-sm text-zinc-600">:</span>
                      <span
                        className={
                          match.scoreB > match.scoreA
                            ? "text-primary"
                            : "text-white"
                        }
                      >
                        {match.scoreB}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-zinc-600">VS</span>
                  )}
                </div>

                {/* Team B */}
                <div className="flex flex-1 items-center justify-start gap-3 text-left">
                  <div className="h-8 w-8 rounded bg-zinc-800/50 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-600">
                    {match.teamB.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {match.teamB}
                  </span>
                </div>
              </div>

              {/* Right: Status & Action */}
              <div className="mt-4 flex w-full items-center justify-between border-t border-white/5 pt-4 md:mt-0 md:w-auto md:border-t-0 md:pt-0">
                <div className="flex items-center gap-3">
                  {match.status === "LIVE" && (
                    <Badge
                      variant="outline"
                      className="border-red-500/30 bg-red-500/10 text-red-500 animate-pulse"
                    >
                      ● LIVE
                    </Badge>
                  )}
                  {match.status === "FINISHED" && (
                    <Badge
                      variant="secondary"
                      className="bg-zinc-800 text-zinc-500 hover:bg-zinc-800"
                    >
                      Final
                    </Badge>
                  )}
                  {match.status === "UPCOMING" && (
                    <Badge
                      variant="outline"
                      className="border-primary/20 text-primary"
                    >
                      Upcoming
                    </Badge>
                  )}
                </div>

                <div className="ml-6">
                  {match.status === "LIVE" ? (
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-zinc-200 font-bold h-8"
                    >
                      <Play className="mr-2 h-3 w-3 fill-current" /> Watch
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-400 hover:text-white h-8 w-8 p-0 md:w-auto md:px-3"
                    >
                      <span className="hidden md:inline">Details</span>
                      <ChevronRight className="md:ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / View All */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            View Full Bracket
          </Button>
        </div>
      </div>
    </section>
  );
}
