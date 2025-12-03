import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Trophy,
  Users,
  ArrowLeft,
  Swords,
  Shield,
  Clock,
} from "lucide-react";
import {
  getTournamentByIdAPI,
  getPublicTournamentTeamsAPI,
} from "@/api/tournaments";
import { getPublicTournamentMatchesAPI } from "@/api/matches";
import { Bracket } from "@/components/tournament/bracket";
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
          getMyTeamAPI(),
        ]);

        setTournament(tData);
        setTeams(
          teamsData.filter((t: any) => t.registration_status === "APPROVED")
        );
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

  if (isLoading) return <div className="text-white">Loading tournament...</div>;
  if (!tournament) return <div className="text-white">Tournament not found</div>;

  // Find my next match
  const myNextMatch = matches.find(
    (m) =>
      (m.teamAId === myTeam?.id || m.teamBId === myTeam?.id) &&
      m.status === "SCHEDULED"
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/tournaments">
            <Button variant="ghost" size="icon" className="text-zinc-400">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">
                {tournament.tournament_name}
              </h1>
              <Badge className="bg-primary">{tournament.status}</Badge>
            </div>
            <p className="text-zinc-400 flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />{" "}
                {new Date(tournament.start_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />{" "}
                {tournament.format?.replace("_", " ")}
              </span>
            </p>
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-zinc-900 border border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Participants</TabsTrigger>
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-zinc-900/50 border-white/10 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">About Tournament</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-400 whitespace-pre-line">
                {tournament.tournament_description ||
                  "No description provided."}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-zinc-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Format</span>
                    <span className="text-white font-medium">
                      {tournament.format?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Teams</span>
                    <span className="text-white font-medium">
                      {teams.length} Registered
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Start Date</span>
                    <span className="text-white font-medium">
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teams.map((team) => (
              <Card
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className="bg-zinc-900/30 border-white/5 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-lg overflow-hidden">
                    {team.logo_url ? (
                      <img
                        src={team.logo_url}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      team.tag?.[0]
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                      {team.name}
                    </h4>
                    <p className="text-xs text-zinc-500">{team.tag}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bracket" className="mt-6">
          {bracketData.length > 0 ? (
            <Bracket rounds={bracketData} />
          ) : (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl">
              Bracket hasn't been generated yet.
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="rounded-xl border border-white/10 bg-zinc-900/30 p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="text-center w-16">
                    <span className="block text-xs text-zinc-500 uppercase font-bold">
                      {match.scheduledAt
                        ? format(new Date(match.scheduledAt), "MMM dd")
                        : "TBD"}
                    </span>
                    <span className="block text-xs text-zinc-600">
                      {match.scheduledAt
                        ? format(new Date(match.scheduledAt), "HH:mm")
                        : "--:--"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold ${
                        match.winnerId === match.teamAId
                          ? "text-primary"
                          : "text-white"
                      }`}
                    >
                      {match.teamAName || "TBD"}
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">VS</span>
                    <span
                      className={`font-bold ${
                        match.winnerId === match.teamBId
                          ? "text-primary"
                          : "text-white"
                      }`}
                    >
                      {match.teamBName || "TBD"}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="border-white/10 text-zinc-400">
                  {match.status}
                </Badge>
              </div>
            ))}
          </div>
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
