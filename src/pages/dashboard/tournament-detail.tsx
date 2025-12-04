import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trophy, Loader2, Calendar, Users } from "lucide-react";
import {
  getTournamentByIdAPI,
  getPublicTournamentTeamsAPI,
} from "@/api/tournaments";
import { getPublicTournamentMatchesAPI } from "@/api/matches";
import { Bracket } from "@/components/tournament/bracket";
import { GroupStageBracket } from "@/components/tournament/group-stage-bracket";
import { TeamRosterDialog } from "@/components/tournament/team-roster-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function DashboardTournamentDetailPage() {
  const { id } = useParams();

  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [bracketData, setBracketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog States
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isRosterOpen, setIsRosterOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tData, teamsData, matchesData] = await Promise.all([
        getTournamentByIdAPI(id!),
        getPublicTournamentTeamsAPI(id!),
        getPublicTournamentMatchesAPI(id!),
      ]);

      setTournament(tData);
      setTeams(teamsData);
      setMatches(matchesData);

      const playoffMatches = matchesData.filter(
        (m: any) => m.stage === "playoffs"
      );
      setBracketData(transformMatchesToBracket(playoffMatches));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const transformMatchesToBracket = (matches: any[]) => {
    if (!matches || matches.length === 0) return [];
    const maxRound = Math.max(...matches.map((m) => m.round));
    const rounds = [];
    const roundNames = ["Quarterfinals", "Semifinals", "Grand Finals"];
    for (let r = 1; r <= maxRound; r++) {
      const roundMatches = matches
        .filter((m) => m.round === r)
        .sort((a, b) => a.matchIndex - b.matchIndex);
      const nameIndex = roundNames.length - (maxRound - r + 1);
      const name = roundNames[nameIndex] || `Round ${r}`;
      rounds.push({
        name: name,
        matches: roundMatches.map((m) => ({
          id: m.id.toString(),
          date: m.scheduledAt
            ? new Date(m.scheduledAt).toLocaleDateString()
            : "TBD",
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

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-zinc-500">
        Tournament not found.
      </div>
    );
  }

  const groupMatches = matches.filter((m: any) => m.stage === "groups");
  const hasGroups = groupMatches.length > 0;
  const groupNames = Array.from(
    new Set(groupMatches.map((m: any) => m.group_name))
  ).sort();

  return (
    <div className="space-y-8 animate-in fade-in pb-10">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50">
        <div className="relative pt-24 md:pt-32 px-6 pb-6 flex flex-col md:flex-row items-end gap-6">
          <div className="h-32 w-32 rounded-xl bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center overflow-hidden shrink-0">
            {tournament.logo_url ? (
              <img
                src={tournament.logo_url}
                className="w-full h-full object-cover"
              />
            ) : (
              <Trophy className="h-12 w-12 text-zinc-600" />
            )}
          </div>
          <div className="flex-1 mb-2">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary">{tournament.status}</Badge>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {tournament.format?.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase">
              {tournament.tournament_name}
            </h1>
            <div className="flex gap-6 text-zinc-400 text-sm font-medium mt-3">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-500" />{" "}
                {new Date(tournament.start_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-zinc-500" /> {teams.length} Teams
              </span>
            </div>
          </div>
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10"
              onClick={loadData}
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-zinc-900 border border-white/10 w-full justify-start overflow-x-auto h-12">
          <TabsTrigger value="overview" className="h-10 px-6">
            Overview
          </TabsTrigger>
          <TabsTrigger value="brackets" className="h-10 px-6">
            Brackets
          </TabsTrigger>
          <TabsTrigger value="teams" className="h-10 px-6">
            Teams
          </TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900/30 border-white/5 h-full">
                <CardHeader>
                  <CardTitle className="text-white">About</CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-400 whitespace-pre-line leading-relaxed">
                  {tournament.tournament_description ||
                    "No description provided."}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-zinc-900/30 border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Region</span>
                    <span className="text-white">Brazil (BR)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">Type</span>
                    <span className="text-white capitalize">
                      {tournament.format?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Organizer</span>
                    <span className="text-white">CSELOL Official</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 2. BRACKETS */}
        <TabsContent value="brackets" className="mt-6">
          <Tabs
            defaultValue={hasGroups ? "groups" : "playoffs"}
            className="w-full"
          >
            <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none h-auto p-0 gap-8">
              <TabsTrigger
                value="groups"
                className="rounded-none border-b-2 border-transparent px-0 pb-3 font-bold uppercase text-zinc-500 data-[state=active]:border-primary data-[state=active]:text-white data-[state=active]:bg-transparent"
              >
                Group Stage
              </TabsTrigger>
              <TabsTrigger
                value="playoffs"
                className="rounded-none border-b-2 border-transparent px-0 pb-3 font-bold uppercase text-zinc-500 data-[state=active]:border-primary data-[state=active]:text-white data-[state=active]:bg-transparent"
              >
                Playoffs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="groups" className="mt-6">
              {groupMatches.length > 0 ? (
                <GroupStageBracket
                  groups={groupNames}
                  matches={groupMatches}
                  teams={teams}
                  isAdmin={false} // Force False for Player View
                />
              ) : (
                <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-zinc-900/10">
                  <p>Group stage matches not generated yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="playoffs" className="mt-6">
              {bracketData.length > 0 ? (
                <div className="overflow-x-auto py-8 bg-zinc-900/20 border border-white/5 rounded-xl">
                  <Bracket
                    rounds={bracketData}
                    // No onMatchClick handler passed here, so it's read-only
                  />
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-zinc-900/10">
                  Playoff bracket not available yet.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* 3. TEAMS */}
        <TabsContent value="teams" className="mt-6">
          {teams.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl">
              No teams registered yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  className="bg-zinc-900/40 border-white/5 overflow-hidden flex flex-col hover:border-primary/20 transition-colors"
                  // Removed OnClick to open roster logic if you wanted pure list view,
                  // but usually clicking to see full roster is fine for players too.
                  // I will keep the roster dialog for read-only view.
                  onClick={() => {
                    setSelectedTeamId(team.id);
                    setIsRosterOpen(true);
                  }}
                >
                  <CardHeader className="bg-white/5 border-b border-white/5 py-3 px-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {team.logo_url ? (
                          <img
                            src={team.logo_url}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-zinc-500">
                            {team.tag?.[0]}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div
                          className="font-bold text-white text-sm truncate"
                          title={team.name}
                        >
                          {team.name}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">
                          [{team.tag}]
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 space-y-1">
                    {team.roster && team.roster.length > 0 ? (
                      team.roster.slice(0, 5).map((member: any) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 transition-colors"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar_url} />
                            <AvatarFallback className="bg-zinc-800 text-[9px] text-zinc-400">
                              {member.nickname?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="w-10 shrink-0">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">
                              {member.primary_role || "N/A"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-1">
                            <span className="text-xs text-zinc-300 truncate">
                              {member.riot_id || member.nickname}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-zinc-600 text-xs py-4 italic">
                        Roster empty.
                      </div>
                    )}
                    {team.roster && team.roster.length > 5 && (
                      <div className="text-center text-[10px] text-zinc-600 pt-1">
                        +{team.roster.length - 5} more...
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* --- Read Only Roster Dialog --- */}
      <TeamRosterDialog
        teamId={selectedTeamId}
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
      />
    </div>
  );
}
