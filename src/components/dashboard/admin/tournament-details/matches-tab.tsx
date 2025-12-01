import { useState, useEffect } from "react";
import { Trophy, Loader2, Plus, RefreshCw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTournamentMatchesAPI, generateBracketAPI } from "@/api/matches";
import {
  generateGroupStageAPI,
  getTournamentTeamsAPI,
} from "@/api/tournaments";
import { Bracket } from "@/components/tournament/bracket";
import { MatchEditorDialog } from "@/components/dashboard/admin/match-editor-dialog";
import { GroupStageView } from "./group-stage-view"; // Import the component we made above
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface MatchesTabProps {
  tournamentId: string;
}

export function TournamentMatchesTab({ tournamentId }: MatchesTabProps) {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<"groups" | "playoffs">("playoffs");

  // Data
  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]); // You'd fetch this from API in real app
  const [bracketData, setBracketData] = useState<any[]>([]);

  // Generator State
  const [groupCount, setGroupCount] = useState(2);
  const [bestOf, setBestOf] = useState(1);

  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Mock Standings for MVP (In real app, fetch from /api/standings)
  // You can leave this empty [] if you haven't built the standings fetcher yet

  const loadData = async () => {
    setLoading(true);
    try {
      const [matchesData] = await Promise.all([
        getTournamentMatchesAPI(tournamentId),
      ]);

      const safeMatches = Array.isArray(matchesData) ? matchesData : [];
      setMatches(safeMatches);

      // Transform for bracket
      setBracketData(
        transformToBracket(
          safeMatches.filter((m: any) => m.stage === "playoffs")
        )
      );

      // Mock standings from matches (Simple calculation)
      const calculatedStandings = calculateStandings(
        safeMatches.filter((m: any) => m.stage === "groups")
      );
      setStandings(calculatedStandings);

      // Auto-detect stage
      if (safeMatches.some((m: any) => m.stage === "groups"))
        setStage("groups");
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  // --- Logic ---
  const handleGenerateGroups = async () => {
    if (!confirm("Overwrite existing schedule?")) return;
    setLoading(true);
    try {
      // Call the API we added in Step 1
      await generateGroupStageAPI(tournamentId, { groups: groupCount, bestOf });
      toast.success("Group stage generated!");
      loadData();
      setStage("groups");
    } catch (e) {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBracket = async () => {
    if (!confirm("Overwrite playoffs?")) return;
    setLoading(true);
    try {
      await generateBracketAPI(tournamentId);
      toast.success("Bracket generated!");
      loadData();
      setStage("playoffs");
    } catch (e) {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (match: any) => {
    setSelectedMatch(match);
    setIsEditorOpen(true);
  };

  // Simple Client-Side Standings Calculator (Temporary until backend API ready)
  const calculateStandings = (matches: any[]) => {
    const stats: any = {};
    matches.forEach((m) => {
      if (m.status !== "completed") return;
      const winner = m.winnerId;
      const loser = m.teamAId === winner ? m.teamBId : m.teamAId;
      if (!winner || !loser) return;

      [winner, loser].forEach((id) => {
        if (!stats[id])
          stats[id] = {
            id,
            name: id === m.teamAId ? m.teamAName : m.teamBName,
            wins: 0,
            losses: 0,
            points: 0,
            group_name: m.group_name,
          };
      });

      stats[winner].wins++;
      stats[winner].points += 3;
      stats[loser].losses++;
    });
    return Object.values(stats);
  };

  const transformToBracket = (matches: any[]) => {
    // ... (Same transformation logic as before) ...
    // Reuse the logic from previous steps
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {stage === "groups" && (
        <div className="space-y-6">
          {matches.some((m) => m.stage === "groups") ? (
            <GroupStageView
              groups={["A", "B"]} // Dynamic in future
              matches={matches.filter((m) => m.stage === "groups")}
              standings={standings}
              onMatchClick={openEditor}
            />
          ) : (
            <Card className="bg-zinc-900/20 border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center">
              <Shuffle className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-bold text-white">
                Generate Group Stage
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Randomly assign teams to groups and create Round Robin schedule.
              </p>

              <div className="flex items-end gap-4 bg-black/40 p-4 rounded-lg border border-white/10">
                <div className="space-y-2 text-left">
                  <Label>Number of Groups</Label>
                  <Input
                    type="number"
                    value={groupCount}
                    onChange={(e) => setGroupCount(parseInt(e.target.value))}
                    className="w-24 bg-zinc-900"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Best Of</Label>
                  <Input
                    type="number"
                    value={bestOf}
                    onChange={(e) => setBestOf(parseInt(e.target.value))}
                    className="w-24 bg-zinc-900"
                  />
                </div>
                <Button onClick={handleGenerateGroups} disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" /> Generate
                </Button>
              </div>
            </Card>
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
            <Card className="bg-zinc-900/20 border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center">
              <Trophy className="h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-bold text-white">
                Generate Playoffs
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Create a single elimination bracket from approved teams.
              </p>
              <Button onClick={handleGenerateBracket} disabled={loading}>
                <Plus className="mr-2 h-4 w-4" /> Generate Bracket
              </Button>
            </Card>
          )}
        </div>
      )}

      <MatchEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        matchToEdit={selectedMatch}
        availableTeams={[]} // fetch teams if needed for dropdown, or pass empty if just editing scores
        onSuccess={loadData}
      />
    </div>
  );
}
