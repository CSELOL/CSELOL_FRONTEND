import {
  Calendar,
  Swords,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
} from "@/components/ui/card";

const upcomingMatches = [
  {
    id: "m-102",
    event: "Season 5 - Group Stage",
    opponent: "Aracaju Void",
    opponentTag: "AJU",
    date: "Today",
    time: "20:00",
    status: "Check-in Open",
    statusColor: "text-emerald-400",
    isLive: false,
  },
  {
    id: "m-105",
    event: "Season 5 - Group Stage",
    opponent: "Lagarto Kings",
    opponentTag: "LGT",
    date: "May 18",
    time: "19:00",
    status: "Scheduled",
    statusColor: "text-zinc-400",
    isLive: false,
  },
];

const matchHistory = [
  {
    id: "m-98",
    event: "Season 5 - Group Stage",
    opponent: "Propriá Punks",
    opponentTag: "PRP",
    result: "Victory",
    score: "1 - 0",
    date: "May 14",
    kda: "12/2/8",
  },
  {
    id: "m-92",
    event: "Season 5 - Group Stage",
    opponent: "Barra Bulls",
    opponentTag: "BAR",
    result: "Defeat",
    score: "0 - 1",
    date: "May 12",
    kda: "4/5/2",
  },
];

export function PlayerMatchesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Match Room</h1>
          <p className="text-zinc-400">
            View schedule, get tournament codes, and report results.
          </p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 border border-white/5 md:w-[400px]">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Upcoming & Live
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            Match History
          </TabsTrigger>
        </TabsList>

        {/* --- TAB: UPCOMING --- */}
        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {upcomingMatches.map((match) => (
            <Card
              key={match.id}
              className="border-white/10 bg-card/40 backdrop-blur-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left: Time Info */}
                <div className="flex flex-col justify-center bg-black/20 p-6 md:w-48 text-center md:text-left md:border-r border-white/5">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-bold uppercase text-xs tracking-wider">
                      {match.date}
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {match.time}
                  </div>
                  <Badge
                    variant="outline"
                    className={`mt-3 w-fit mx-auto md:mx-0 border-0 bg-zinc-900 ${match.statusColor}`}
                  >
                    {match.status}
                  </Badge>
                </div>

                {/* Center: Matchup */}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Swords className="h-3 w-3" /> {match.event}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    {/* Us */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/30">
                        YOU
                      </div>
                      <span className="font-bold text-lg text-white">
                        Sergipe Slayers
                      </span>
                    </div>

                    <span className="text-zinc-600 font-mono font-bold">
                      VS
                    </span>

                    {/* Them */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold border border-white/5">
                        {match.opponentTag}
                      </div>
                      <span className="font-bold text-lg text-zinc-300">
                        {match.opponent}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="p-6 flex items-center justify-center md:border-l border-white/5 bg-white/5">
                  {/* Botao do discord mudar futuro URL */}
                  <Button
                    className="w-full md:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold shadow-lg shadow-[#5865F2]/20"
                    onClick={() =>
                      window.open(
                        "https://discord.gg/YOUR_DISCORD_LINK",
                        "_blank"
                      )
                    }
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2763-3.68-.2763-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                    </svg>
                    Join Discord Lobby
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Alert Box */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm">
              <strong className="text-blue-300 block mb-1">
                Tournament Rule #4.2
              </strong>
              <span className="text-blue-200/70">
                Teams must check in 15 minutes before the scheduled start time.
                Failure to check in may result in automatic forfeiture.
              </span>
            </div>
          </div>
        </TabsContent>

        {/* --- TAB: HISTORY --- */}
        <TabsContent value="history" className="mt-6">
          <div className="rounded-xl border border-white/10 bg-card/30 overflow-hidden">
            {matchHistory.map((match, i) => (
              <div
                key={match.id}
                className={`flex items-center justify-between p-4 ${
                  i !== matchHistory.length - 1 ? "border-b border-white/5" : ""
                } hover:bg-white/5 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      match.result === "Victory"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {match.result === "Victory" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Swords className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {match.result} vs {match.opponentTag}
                    </div>
                    <div className="text-xs text-zinc-500">{match.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white">
                    {match.score}
                  </div>
                  <div className="text-xs text-zinc-500">KDA: {match.kda}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
