import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Trophy,
  Users,
  ArrowLeft,
  Swords,
  Clock,
  Info,
  Activity,
} from "lucide-react";
import {
  getTournamentByIdAPI,
  getPublicTournamentTeamsAPI,
} from "@/api/tournaments";
import { getPublicTournamentMatchesAPI } from "@/api/matches";
import { Bracket } from "@/components/tournament/bracket";
import { MatchList } from "@/components/tournament/match-list";
import { GroupStandings } from "@/components/tournament/group-standings";
import { TeamRosterDialog } from "@/components/tournament/team-roster-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getMyTeamAPI } from "@/api/teams";

export function DashboardTournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [myTeam, setMyTeam] = useState<any>(null);
  const [bracketData, setBracketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Roster Dialog State
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isRosterOpen, setIsRosterOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [tData, teamsData, matchesData, myTeamData] = await Promise.all([
          getTournamentByIdAPI(id!),
          getPublicTournamentTeamsAPI(id!),
          getPublicTournamentMatchesAPI(id!),
          getMyTeamAPI().catch(() => null),
        ]);

        setTournament(tData);
        setTeams(teamsData);
        setMatches(matchesData);
        setMyTeam(myTeamData);
        setBracketData(transformMatchesToBracket(matchesData));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const transformMatchesToBracket = (matches: any[]) => {
    if (!matches || matches.length === 0) return [];

    const playoffMatches = matches.filter((m) => !m.group_name);

    if (playoffMatches.length === 0) return [];

    const maxRound = Math.max(...playoffMatches.map((m) => m.round));
    const rounds = [];
    const roundNames = ["Quarterfinals", "Semifinals", "Grand Finals"];

    for (let r = 1; r <= maxRound; r++) {
      const roundMatches = playoffMatches
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
            isWinner: m.winnerId && m.winnerId === m.teamAId,
          },
          team2: {
            name: m.teamBName || "TBD",
            tag: m.teamBTag,
            score: m.scoreB,
            isWinner: m.winnerId && m.winnerId === m.teamBId,
          },
        })),
      });
    }
    return rounds;
  };

  const handleTeamClick = (teamId: number) => {
    setSelectedTeamId(teamId);
    setIsRosterOpen(true);
  };

  if (isLoading)
    return <div className="text-white p-8">Loading tournament...</div>;
  if (!tournament)
    return <div className="text-white p-8">Tournament not found</div>;

  // Find my next match
  const myNextMatch = matches.find(
    (m) =>
      (m.teamAId === myTeam?.id || m.teamBId === myTeam?.id) &&
      m.status === "SCHEDULED"
  );

  const hasGroups = matches.some((m) => m.group_name);

  return (
    <div className="space-y-8 animate-in fade-in pb-10">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50">
        {/* Banner Background */}
        <div className="absolute inset-0 h-48 md:h-64">
          {tournament.banner_url ? (
            <img
              src={tournament.banner_url}
              className="w-full h-full object-cover opacity-40"
              alt="Tournament Banner"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-purple-500/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        <div className="relative pt-24 md:pt-32 px-6 pb-6 flex flex-col md:flex-row items-end gap-6">
          {/* Logo */}
          <div className="h-32 w-32 rounded-xl border-4 border-zinc-950 bg-zinc-900 shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
            {tournament.logo_url ? (
              <img
                src={tournament.logo_url}
                className="w-full h-full object-cover"
                alt="Logo"
              />
            ) : (
              <Trophy className="h-12 w-12 text-zinc-600" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 mb-2">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary hover:bg-primary/90">
                {tournament.status}
              </Badge>
              {hasGroups && (
                <Badge variant="outline" className="border-white/20 text-zinc-300">
                  Group Stage
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-2">
              {tournament.tournament_name}
            </h1>
            <div className="flex flex-wrap gap-4 text-zinc-400 text-sm font-medium">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(tournament.start_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {teams.length} Teams
              </span>
              <span className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                {tournament.format?.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="mb-2">
            <Link to="/dashboard/tournaments">
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-zinc-400"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* My Next Match Banner */}
      {myNextMatch && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Swords className="h-32 w-32 text-primary" />
          </div>
          <div className="relative z-10">
            <h3 className="text-primary font-bold flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" /> Your Next Match
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">
                    {myNextMatch.teamAName}
                  </span>
                </div>
                <span className="text-zinc-500 font-bold text-xl">VS</span>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">
                    {myNextMatch.teamBName}
                  </span>
                </div>
              </div>
              <div className="h-8 w-px bg-primary/20 hidden md:block" />
              <div className="text-center md:text-left">
                <p className="text-zinc-300">
                  {format(new Date(myNextMatch.scheduledAt), "PPP p")}
                </p>
                <p className="text-sm text-primary/80 font-bold uppercase">
                  {myNextMatch.round_name || `Round ${myNextMatch.round}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-zinc-900 border border-white/10 w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matches">Schedule</TabsTrigger>
          {hasGroups && <TabsTrigger value="standings">Standings</TabsTrigger>}
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
          <TabsTrigger value="teams">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Description */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-zinc-900/30 border-white/5">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" /> About Tournament
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-400 leading-relaxed whitespace-pre-line">
                  {tournament.tournament_description ||
                    "No description provided for this tournament."}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Details & Info */}
            <div className="space-y-6">
              <Card className="bg-zinc-900/30 border-white/5">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" /> Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500 text-sm">Format</span>
                    <span className="text-white font-medium">
                      {tournament.format?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500 text-sm">Start Date</span>
                    <span className="text-white font-medium">
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500 text-sm">Teams</span>
                    <span className="text-white font-medium">
                      {teams.length} Registered
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-zinc-500 text-sm">Region</span>
                    <span className="text-white font-medium">
                      {tournament.region || "Global"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-500 text-sm">Status</span>
                    <Badge
                      variant="outline"
                      className="border-primary/20 text-primary"
                    >
                      {tournament.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <MatchList matches={matches} />
        </TabsContent>

        {hasGroups && (
          <TabsContent value="standings" className="mt-6">
            <GroupStandings matches={matches} teams={teams} />
          </TabsContent>
        )}

        <TabsContent value="bracket" className="mt-6">
          {bracketData.length > 0 ? (
            <Bracket rounds={bracketData} />
          ) : (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl">
              Bracket hasn't been generated yet or no playoff matches found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          {teams.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl">
              No teams registered yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  onClick={() => handleTeamClick(team.id)}
                  className="bg-zinc-900/30 border-white/5 hover:border-primary/50 transition-colors group cursor-pointer"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-lg overflow-hidden shrink-0">
                      {team.logo_url ? (
                        <img
                          src={team.logo_url}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        team.tag?.[0]
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors truncate">
                        {team.name}
                      </h4>
                      <p className="text-xs text-zinc-500">{team.tag}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TeamRosterDialog
        teamId={selectedTeamId}
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
      />
    </div>
  );
}
