import { useState, useEffect } from "react";
import { Plus, Trophy, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getTournamentMatchesAPI, generateBracketAPI } from "@/api/matches";
import { getTournamentTeamsAPI } from "@/api/tournaments";
import { GroupAssignmentView } from "./group-management/GroupAssignmentView";
import { ScheduleGenerator } from "./match-management/ScheduleGenerator";
import { MatchCreatorDialog } from "./match-management/MatchCreatorDialog";

interface ManagementTabProps {
  tournamentId: string;
}

export function TournamentManagementTab({ tournamentId }: ManagementTabProps) {
  const [activeView, setActiveView] = useState<"groups" | "playoffs">("groups");
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [isMatchCreatorOpen, setIsMatchCreatorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // New state to keep current groups for the generator
  const [groups, setGroups] = useState<{ id: string; name: string; teams: any[] }[]>([]);

  const loadData = async () => {
    try {
      const [matchesData, teamsData] = await Promise.all([
        getTournamentMatchesAPI(tournamentId),
        getTournamentTeamsAPI(tournamentId),
      ]);
      setMatches(Array.isArray(matchesData) ? matchesData : []);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  const handleGenerateBracket = async () => {
    if (!confirm("This will overwrite existing playoff matches. Continue?")) return;
    setLoading(true);
    try {
      await generateBracketAPI(tournamentId);
      toast.success("Bracket generated!");
      loadData();
    } catch (e) {
      toast.error("Failed to generate bracket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v)} className="w-[400px]">
          <TabsList className="bg-zinc-900">
            <TabsTrigger value="groups">Group Stage</TabsTrigger>
            <TabsTrigger value="playoffs">Playoffs</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={() => setIsMatchCreatorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Single Match
        </Button>
      </div>

      {activeView === "groups" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-zinc-900/30 p-4 rounded-lg border border-white/5">
            <div>
              <h3 className="text-white font-bold">Group Assignments</h3>
              <p className="text-sm text-zinc-400">Drag and drop teams to assign them to groups.</p>
            </div>
            <ScheduleGenerator
              tournamentId={tournamentId}
              groups={groups}
              onSuccess={loadData}
            />
          </div>

          <GroupAssignmentView
            tournamentId={tournamentId}
            allTeams={teams}
            onSave={loadData}
            onCancel={() => {}}
            onGroupsChange={setGroups}
          />
        </div>
      )}

      {activeView === "playoffs" && (
        <div className="space-y-6">
          <Card className="bg-zinc-900/20 border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center">
            <Trophy className="h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-bold text-white">Generate Playoffs Bracket</h3>
            <p className="text-zinc-400 text-sm mb-6 max-w-md">
              Automatically generate a single elimination bracket based on the top teams from the group stage (or all teams if no groups).
            </p>
            <Button onClick={handleGenerateBracket} disabled={loading}>
              <Settings2 className="mr-2 h-4 w-4" /> Generate Bracket
            </Button>
          </Card>
        </div>
      )}

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
