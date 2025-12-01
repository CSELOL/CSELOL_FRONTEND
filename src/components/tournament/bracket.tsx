import { Trophy, Swords, Crown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Shared Types ---
export type BracketTeam = {
  name: string;
  score?: number;
  isWinner?: boolean;
  tag?: string;
};

export type BracketMatch = {
  id: string;
  team1: BracketTeam;
  team2: BracketTeam;
  status: "played" | "live" | "scheduled" | "completed";
  date?: string;
};

export type BracketRound = {
  name: string;
  matches: BracketMatch[];
};

// --- Components ---

const TeamRow = ({
  team,
  isBottom,
}: {
  team: BracketTeam;
  isBottom?: boolean;
}) => (
  <div
    className={cn(
      "flex items-center justify-between px-3 py-2",
      isBottom ? "" : "border-b border-white/5",
      team.isWinner ? "bg-primary/5" : ""
    )}
  >
    <div className="flex items-center gap-3">
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

const MatchCard = ({
  match,
  onClick,
}: {
  match: BracketMatch;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "group relative flex w-64 flex-col rounded-lg border border-white/10 bg-card/40 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-[0_0_15px_-5px_rgba(var(--primary),0.2)]",
      onClick && "cursor-pointer hover:bg-white/5"
    )}
  >
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
        ) : match.status === "played" || match.status === "completed" ? (
          <>
            <Swords className="h-3 w-3" /> Finished
          </>
        ) : (
          <>
            <Calendar className="h-3 w-3" />{" "}
            {match.date ? new Date(match.date).toLocaleDateString() : "TBD"}
          </>
        )}
      </div>
      <span className="text-[10px] text-zinc-600 font-mono">#{match.id}</span>
    </div>
    <div className="flex flex-col">
      <TeamRow team={match.team1} />
      <TeamRow team={match.team2} isBottom />
    </div>
  </div>
);

interface BracketProps {
  rounds: BracketRound[];
  onMatchClick?: (matchId: string) => void;
}

export function Bracket({ rounds, onMatchClick }: BracketProps) {
  if (!rounds || rounds.length === 0) return null;

  return (
    <section className="w-full py-10 text-foreground">
      <div className="relative w-full overflow-x-auto pb-12 custom-scrollbar">
        <div className="flex min-w-max justify-center gap-8 md:gap-16 px-4">
          {rounds.map((round, roundIndex) => {
            // Determine if this is the final round
            const isFinal = roundIndex === rounds.length - 1;

            return (
              <div
                key={round.name}
                className="flex flex-col justify-around gap-8"
              >
                <h3 className="text-center text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-center gap-2">
                  {isFinal && <Crown className="h-4 w-4 text-yellow-500" />}
                  {round.name}
                </h3>

                {round.matches.map((match) => (
                  <div key={match.id} className="relative flex items-center">
                    {/* Connectors for rounds > 1 */}
                    {roundIndex > 0 && (
                      <div className="absolute -left-8 md:-left-16 top-0 bottom-0 w-8 md:w-16 flex items-center">
                        <div className="absolute top-0 left-0 h-[50%] w-full border-b border-l border-white/10 rounded-bl-xl" />
                        <div className="absolute bottom-0 left-0 h-[50%] w-full border-t border-l border-white/10 rounded-tl-xl" />
                        <div className="absolute right-0 h-px w-4 bg-white/10" />
                      </div>
                    )}

                    <div className={isFinal ? "relative" : ""}>
                      {isFinal && (
                        <div className="absolute inset-0 -z-10 blur-2xl bg-primary/10 rounded-full" />
                      )}
                      <MatchCard
                        match={match}
                        onClick={() => onMatchClick && onMatchClick(match.id)}
                      />
                    </div>

                    {/* Connector to right (except finals) */}
                    {!isFinal && (
                      <div className="absolute -right-8 md:-right-16 top-1/2 h-px w-8 md:w-16 bg-white/10" />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
