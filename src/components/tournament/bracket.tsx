import * as React from "react";
import { Trophy, Swords, Crown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// --- Types for our Data ---
type Team = {
  name: string;
  score?: number;
  isWinner?: boolean;
  tag?: string;
};

type Match = {
  id: string;
  team1: Team;
  team2: Team;
  status: "played" | "live" | "scheduled";
  date?: string;
};

type Round = {
  name: string;
  matches: Match[];
};

// --- Mock Data (8 Teams -> Champion) ---
const tournamentData: Round[] = [
  {
    name: "Quarterfinals",
    matches: [
      {
        id: "qf1",
        status: "played",
        team1: {
          name: "Sergipe Slayers",
          tag: "SLY",
          score: 2,
          isWinner: true,
        },
        team2: { name: "Lagarto Kings", tag: "LGT", score: 0 },
      },
      {
        id: "qf2",
        status: "played",
        team1: { name: "Propriá Punks", tag: "PRP", score: 1 },
        team2: {
          name: "Estância Eagles",
          tag: "EST",
          score: 2,
          isWinner: true,
        },
      },
      {
        id: "qf3",
        status: "live",
        team1: { name: "Aracaju Void", tag: "AJU", score: 1 },
        team2: { name: "Itabaiana Saints", tag: "ITA", score: 1 },
      },
      {
        id: "qf4",
        status: "scheduled",
        date: "Today 20:00",
        team1: { name: "Barra Bulls", tag: "BAR" },
        team2: { name: "Socorro Spirits", tag: "SOC" },
      },
    ],
  },
  {
    name: "Semifinals",
    matches: [
      {
        id: "sf1",
        status: "scheduled",
        date: "Tomorrow",
        team1: { name: "Sergipe Slayers", tag: "SLY" }, // Advanced from QF1
        team2: { name: "Estância Eagles", tag: "EST" }, // Advanced from QF2
      },
      {
        id: "sf2",
        status: "scheduled",
        date: "TBD",
        team1: { name: "TBD", tag: "?" },
        team2: { name: "TBD", tag: "?" },
      },
    ],
  },
  {
    name: "Grand Finals",
    matches: [
      {
        id: "gf1",
        status: "scheduled",
        date: "18 May",
        team1: { name: "TBD", tag: "?" },
        team2: { name: "TBD", tag: "?" },
      },
    ],
  },
];

// --- Components ---

// 1. Individual Team Row in a Match
const TeamRow = ({ team, isBottom }: { team: Team; isBottom?: boolean }) => (
  <div
    className={cn(
      "flex items-center justify-between px-3 py-2",
      isBottom ? "" : "border-b border-white/5",
      team.isWinner ? "bg-primary/5" : ""
    )}
  >
    <div className="flex items-center gap-3">
      {/* Placeholder Logo */}
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold",
          team.isWinner
            ? "bg-primary text-background"
            : "bg-zinc-800 text-zinc-500"
        )}
      >
        {team.tag ? team.tag.substring(0, 1) : "?"}
      </div>
      <span
        className={cn(
          "text-sm font-medium truncate max-w-[100px] md:max-w-[140px]",
          team.isWinner ? "text-white" : "text-zinc-400",
          !team.name.includes("TBD") && "uppercase"
        )}
      >
        {team.name}
      </span>
    </div>
    <span
      className={cn(
        "font-mono text-sm font-bold",
        team.isWinner ? "text-primary" : "text-zinc-600"
      )}
    >
      {team.score ?? "-"}
    </span>
  </div>
);

// 2. The Match Card
const MatchCard = ({ match }: { match: Match }) => (
  <div className="group relative flex w-64 flex-col rounded-lg border border-white/10 bg-card/40 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-[0_0_15px_-5px_rgba(var(--primary),0.2)]">
    {/* Header / Status */}
    <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-3 py-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {match.status === "live" ? (
          <>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <span className="text-red-500">Live</span>
          </>
        ) : match.status === "played" ? (
          <>
            <Swords className="h-3 w-3" /> Finished
          </>
        ) : (
          <>
            <Calendar className="h-3 w-3" /> {match.date}
          </>
        )}
      </div>
      <span className="text-[10px] text-zinc-600 font-mono">
        #{match.id.toUpperCase()}
      </span>
    </div>

    {/* Teams */}
    <div className="flex flex-col">
      <TeamRow team={match.team1} />
      <TeamRow team={match.team2} isBottom />
    </div>
  </div>
);

// 3. Main Bracket Export
export function Bracket() {
  return (
    <section className="w-full bg-background py-20 text-foreground">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-primary/20 text-primary"
          >
            Main Event
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Playoffs Bracket
          </h2>
          <p className="mt-2 text-zinc-400">
            The road to the R$ 10.000 championship.
          </p>
        </div>

        {/* 
                SCROLL WRAPPER: 
                Brackets get wide. Overflow-auto is mandatory for mobile.
            */}
        <div className="relative w-full overflow-x-auto pb-12 custom-scrollbar">
          {/* 
                    FLEX CONTAINER:
                    Columns = Rounds.
                    min-w-max ensures it doesn't squish on mobile.
                */}
          <div className="flex min-w-max justify-center gap-8 md:gap-16 px-4">
            {/* --- ROUND 1: Quarterfinals --- */}
            <div className="flex flex-col justify-around gap-8">
              <h3 className="text-center text-sm font-bold uppercase tracking-widest text-zinc-500">
                Quarterfinals
              </h3>
              {tournamentData[0].matches.map((match, i) => (
                <div key={match.id} className="relative flex items-center">
                  <MatchCard match={match} />
                  {/* Connector Line (Right) */}
                  <div className="absolute -right-8 md:-right-16 top-1/2 h-px w-8 md:w-16 bg-white/10" />
                </div>
              ))}
            </div>

            {/* --- ROUND 2: Semifinals --- */}
            <div className="flex flex-col justify-around gap-8">
              <h3 className="text-center text-sm font-bold uppercase tracking-widest text-zinc-500">
                Semifinals
              </h3>
              {tournamentData[1].matches.map((match) => (
                <div key={match.id} className="relative flex items-center">
                  {/* Connector Arms (Left) - Creating the "Fork" */}
                  <div className="absolute -left-8 md:-left-16 top-0 bottom-0 w-8 md:w-16 flex items-center">
                    {/* Top Arm */}
                    <div className="absolute top-0 left-0 h-[50%] w-full border-b border-l border-white/10 rounded-bl-xl" />
                    {/* Bottom Arm */}
                    <div className="absolute bottom-0 left-0 h-[50%] w-full border-t border-l border-white/10 rounded-tl-xl" />
                    {/* Straight line connecting to match */}
                    <div className="absolute right-0 h-px w-4 bg-white/10" />
                  </div>

                  <MatchCard match={match} />

                  {/* Connector Line (Right) */}
                  <div className="absolute -right-8 md:-right-16 top-1/2 h-px w-8 md:w-16 bg-white/10" />
                </div>
              ))}
            </div>

            {/* --- ROUND 3: Finals --- */}
            <div className="flex flex-col justify-center gap-8">
              <h3 className="text-center text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" /> Grand Final
              </h3>
              {tournamentData[2].matches.map((match) => (
                <div key={match.id} className="relative flex items-center">
                  {/* Connector Arms (Left) */}
                  <div className="absolute -left-8 md:-left-16 top-0 bottom-0 w-8 md:w-16 flex items-center">
                    <div className="absolute top-0 left-0 h-[50%] w-full border-b border-l border-white/10 rounded-bl-xl" />
                    <div className="absolute bottom-0 left-0 h-[50%] w-full border-t border-l border-white/10 rounded-tl-xl" />
                    <div className="absolute right-0 h-px w-4 bg-white/10" />
                  </div>

                  {/* Special Styling for Finals */}
                  <div className="relative">
                    {/* Glow behind the final match */}
                    <div className="absolute inset-0 -z-10 blur-2xl bg-primary/10 rounded-full" />
                    <MatchCard match={match} />
                  </div>

                  {/* Champion Trophy Placeholder (Right) */}
                  <div className="absolute -right-24 flex flex-col items-center justify-center opacity-30">
                    <Trophy className="h-12 w-12 text-yellow-500 mb-2" />
                    <span className="text-xs font-bold uppercase text-zinc-600">
                      Champion
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
