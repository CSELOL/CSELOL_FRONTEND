import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTournamentMatchesAPI } from "@/api/matches";
import { Bracket } from "@/components/tournament/bracket";
import { MatchEditorDialog } from "@/components/dashboard/admin/match-editor-dialog";
import { GroupStageView } from "./group-stage-view";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MatchesTabProps {
  tournamentId: string;
}

export function TournamentMatchesTab({ tournamentId }: MatchesTabProps) {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<"groups" | "playoffs">("groups");

  // Data
  const [matches, setMatches] = useState<any[]>([]);
  const [bracketData, setBracketData] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);

  // UI State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const matchesData = await getTournamentMatchesAPI(tournamentId);
      const safeMatches = Array.isArray(matchesData) ? matchesData : [];
      setMatches(safeMatches);

      // Transform for bracket
      setBracketData(
        transformToBracket(
          safeMatches.filter((m: any) => m.stage === "playoffs")
        )
      );
      
      // Calculate standings for group view context (if needed for display)
      setStandings(calculateStandings(safeMatches.filter((m: any) => m.stage === "groups")));

    } catch (error) {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  const openEditor = (match: any) => {
    setSelectedMatch(match);
    setIsEditorOpen(true);
  };

  const transformToBracket = (matches: any[]) => {
    if (!matches || !matches.length) return [];
    const maxRound = Math.max(...matches.map((m: any) => m.round));
    const rounds = [];
    const roundNames = ["Quarterfinals", "Semifinals", "Grand Finals"];
    for (let r = 1; r <= maxRound; r++) {
      const roundMatches = matches
        .filter((m: any) => m.round === r)
        .sort((a: any, b: any) => a.matchIndex - b.matchIndex);
      const nameIndex = roundNames.length - (maxRound - r + 1);
      rounds.push({
        name: roundNames[nameIndex] || `Round ${r}`,
        matches: roundMatches.map((m: any) => ({
          id: m.id.toString(),
          date: m.scheduledAt,
          status: m.status,
          team1: {
            name: m.teamAName || "TBD",
            tag: m.teamATag,
            score: m.scoreA,
            isWinner: m.winnerId === m.teamAId,
          },
          team2: {
            name: m.teamBName || "TBD",
            tag: m.teamBTag,
            score: m.scoreB,
            isWinner: m.winnerId === m.teamBId,
          },
        })),
      });
    }
    return rounds;
  };

  const calculateStandings = (matches: any[]) => {
      // Simplified standings just for passing to GroupStageView if it needs it
      // ... (Same logic as before)
      const stats: any = {};
      matches.forEach((m) => {
        if (m.status !== "completed") return;
        const winner = m.winnerId;
        const loser = m.teamAId === winner ? m.teamBId : m.teamAId;
        if (!winner || !loser) return;
  
        [winner, loser].forEach((id) => {
          if (!stats[id])
            stats[id] = { id, wins: 0, losses: 0, points: 0 };
        });
  
        stats[winner].wins++;
        stats[winner].points += 3;
        stats[loser].losses++;
      });
      return Object.values(stats);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs
          value={stage}
          onValueChange={(v: any) => setStage(v)}
          className="w-[400px]"
        >
          <TabsList className="bg-zinc-900">
            <TabsTrigger value="groups">Group Stage</TabsTrigger>
            <TabsTrigger value="playoffs">Playoffs</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {stage === "groups" && (
        <div className="space-y-6">
          {matches.some((m) => m.stage === "groups") ? (
            <GroupStageView
              groups={Array.from(new Set(matches.filter(m => m.stage === "groups").map(m => m.group_name || "A"))).sort()}
              matches={matches.filter((m) => m.stage === "groups")}
              standings={standings}
              onMatchClick={openEditor}
            />
          ) : (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl">
              No group stage matches scheduled. Go to "Management" to set up groups.
            </div>
          )}
        </div>
      )}

      {stage === "playoffs" && (
        <div className="space-y-6">
          {matches.some((m) => m.stage === "playoffs") ? (
            <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 overflow-x-auto">
              <Bracket
                rounds={bracketData}
                onMatchClick={(id) =>
                  openEditor(matches.find((m) => m.id.toString() === id))
                }
              />
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl">
              No playoff matches scheduled. Go to "Management" to generate bracket.
            </div>
          )}
        </div>
      )}

      <MatchEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        matchToEdit={selectedMatch}
        availableTeams={[]} // Not needed for just editing scores usually, but might need for team swap
        onSuccess={loadData}
      />
    </div>
  );
}
