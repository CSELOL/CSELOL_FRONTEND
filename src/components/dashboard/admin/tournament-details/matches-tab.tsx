import { useState, useEffect } from "react";
import { Trophy, Plus, RefreshCw, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTournamentMatchesAPI, generateBracketAPI } from "@/api/matches";
import {
  getTournamentTeamsAPI,
} from "@/api/tournaments";
import { Bracket } from "@/components/tournament/bracket";
import { MatchEditorDialog } from "@/components/dashboard/admin/match-editor-dialog";
import { GroupStageView } from "./group-stage-view";
import { GroupAssignmentView } from "./group-management/GroupAssignmentView";
import { MatchCreatorDialog } from "./match-management/MatchCreatorDialog";
import { ScheduleGenerator } from "./match-management/ScheduleGenerator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface MatchesTabProps {
  tournamentId: string;
}

export function TournamentMatchesTab({ tournamentId }: MatchesTabProps) {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<"groups" | "playoffs">("groups");

  // Data
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [bracketData, setBracketData] = useState<any[]>([]);

  // UI State
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isMatchCreatorOpen, setIsMatchCreatorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matchesData, teamsData] = await Promise.all([
        getTournamentMatchesAPI(tournamentId),
        getTournamentTeamsAPI(tournamentId),
      ]);

      const safeMatches = Array.isArray(matchesData) ? matchesData : [];
      setMatches(safeMatches);
      setTeams(Array.isArray(teamsData) ? teamsData : []);

      // Transform for bracket
      setBracketData(
        transformToBracket(
          safeMatches.filter((m: any) => m.stage === "playoffs")
        )
      );

      // Mock standings from matches
      const calculatedStandings = calculateStandings(
        safeMatches.filter((m: any) => m.stage === "groups")
      );
      setStandings(calculatedStandings);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tournamentId]);

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

  // Helper to extract groups from matches/standings for the generator
  const getGroupsForGenerator = () => {
    // This is a bit hacky since we don't have a direct "get groups" API yet
    // We infer groups from the teams or matches
    // For now, let's assume we want to generate for all teams if no matches exist
    // Or if matches exist, we group them by group_name
    const groupsMap: any = {};
    
    // If we have standings, use them to find groups
    if (standings.length > 0) {
        standings.forEach((s: any) => {
            if (!groupsMap[s.group_name]) groupsMap[s.group_name] = [];
            groupsMap[s.group_name].push(teams.find(t => t.id === s.id) || { id: s.id, name: s.name });
        });
    } else {
        // Fallback: if no standings, maybe we just have teams assigned (but we can't see that without the API)
        // So for now, we pass empty and let the user use the Manual Setup to assign first
    }

    return Object.keys(groupsMap).map(name => ({
        id: `group-${name}`,
        name: `Group ${name}`,
        teams: groupsMap[name]
    }));
  };

  if (isSetupMode) {
    return (
      <GroupAssignmentView
        tournamentId={tournamentId}
        allTeams={teams}
        onSave={() => {
          setIsSetupMode(false);
          loadData();
        }}
        onCancel={() => setIsSetupMode(false)}
      />
    );
  }

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMatchCreatorOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Match
          </Button>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {stage === "groups" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-zinc-900/30 p-4 rounded-lg border border-white/5">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                Group Stage Management
              </h3>
            </div>
            <div className="flex items-center gap-2">
               {/* Schedule Generator only if matches exist but we want to regenerate? Or maybe just hide it. 
                   User said: "after we place every team in groups, we should save the groups and get into scheduling phase."
                   So if matches exist, we are in scheduling/view phase. 
                   Let's keep ScheduleGenerator but maybe move it or keep it here for regeneration.
                   For now, I'll keep it but remove Manual Setup button since it's default view if no matches.
                   Actually, if matches exist, we might want to go BACK to setup.
               */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsSetupMode(true)}
              >
                <Settings2 className="h-4 w-4 mr-2" /> Edit Groups
              </Button>
              <ScheduleGenerator
                tournamentId={tournamentId}
                groups={getGroupsForGenerator()}
                onSuccess={loadData}
              />
            </div>
          </div>

          {matches.some((m) => m.stage === "groups") ? (
            <GroupStageView
              groups={Array.from(new Set(matches.filter(m => m.stage === "groups").map(m => m.group_name || "A"))).sort()}
              matches={matches.filter((m) => m.stage === "groups")}
              standings={standings}
              onMatchClick={openEditor}
            />
          ) : (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-zinc-900/30 p-4 rounded-lg border border-white/5">
                    <div className="flex items-center gap-4">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                            Setup Group Stage
                        </h3>
                    </div>
                </div>
                <GroupAssignmentView
                    tournamentId={tournamentId}
                    allTeams={teams}
                    onSave={() => {
                        loadData();
                    }}
                    onCancel={() => {}} // No cancel needed as it's the default view
                />
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
        availableTeams={teams}
        onSuccess={loadData}
      />

      <MatchCreatorDialog
        open={isMatchCreatorOpen}
        onOpenChange={setIsMatchCreatorOpen}
        tournamentId={tournamentId}
        availableTeams={teams}
        onSuccess={loadData}
      />
    </div>
  );
}
