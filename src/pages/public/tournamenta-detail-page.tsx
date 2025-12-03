import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Trophy, Users, Shield } from "lucide-react";
import { getTournamentByIdAPI, getPublicTournamentTeamsAPI } from "@/api/tournaments";
import { getPublicTournamentMatchesAPI } from "@/api/matches";
import { Bracket } from "@/components/tournament/bracket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function PublicTournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [bracketData, setBracketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [tData, teamsData, matchesData] = await Promise.all([
          getTournamentByIdAPI(id!),
          getPublicTournamentTeamsAPI(id!),
          getPublicTournamentMatchesAPI(id!),
        ]);

        setTournament(tData);
        setTeams(
          teamsData.filter((t: any) => t.registration_status === "APPROVED")
        );
        setBracketData(transformMatchesToBracket(matchesData));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Reuse the transformer logic (consider moving this to a utils file later)
  // UPDATE THIS FUNCTION INSIDE THE COMPONENT
  const transformMatchesToBracket = (matches: any[]) => {
    if (!matches || matches.length === 0) return [];

    const maxRound = Math.max(...matches.map((m) => m.round));
    const rounds = [];
    const roundNames = ["Quarterfinals", "Semifinals", "Grand Finals"]; // Or generate dynamically

    for (let r = 1; r <= maxRound; r++) {
      const roundMatches = matches
        .filter((m) => m.round === r)
        .sort((a, b) => a.matchIndex - b.matchIndex); // Note: matchIndex (camelCase)

      // Dynamic naming fallback
      const nameIndex = roundNames.length - (maxRound - r + 1);
      const name = roundNames[nameIndex] || `Round ${r}`;

      rounds.push({
        name: name,
        matches: roundMatches.map((m) => ({
          id: m.id.toString(),
          // FIX 1: Use 'scheduledAt'
          date: m.scheduledAt
            ? new Date(m.scheduledAt).toLocaleDateString()
            : "TBD",
          status: m.status,
          // FIX 2: Map Team A -> Team 1
          team1: {
            name: m.teamAName || "TBD",
            tag: m.teamATag,
            score: m.scoreA,
            isWinner: m.winnerId && m.winnerId === m.teamAId,
          },
          // FIX 3: Map Team B -> Team 2
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

  if (isLoading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!tournament)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Tournament not found
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        {tournament.banner_url ? (
          <img
            src={tournament.banner_url}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}

        <div className="absolute bottom-0 left-0 w-full p-8 z-20 container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {tournament.logo_url && (
              <img
                src={tournament.logo_url}
                className="w-32 h-32 rounded-xl border-4 border-black shadow-2xl"
              />
            )}
            <div className="mb-2">
              <Badge className="mb-2 bg-primary hover:bg-primary">
                {tournament.status}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
                {tournament.tournament_name}
              </h1>
              <div className="flex gap-4 text-zinc-300 mt-2 text-sm font-bold">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />{" "}
                  {new Date(tournament.start_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> {teams.length} Teams
                </span>
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />{" "}
                  {tournament.format?.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <Tabs defaultValue="bracket" className="w-full">
          <TabsList className="bg-zinc-900/50 border border-white/10">
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="teams">Participants</TabsTrigger>
            <TabsTrigger value="rules">Rules & Info</TabsTrigger>
          </TabsList>

          <TabsContent value="bracket" className="mt-8">
            {bracketData.length > 0 ? (
              <Bracket rounds={bracketData} />
            ) : (
              <div className="text-center py-20 text-zinc-500">
                Bracket hasn't been generated yet.
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="teams"
            className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {teams.map((team) => (
              <Card
                key={team.id}
                className="bg-zinc-900/30 border-white/5 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-lg">
                    {team.logo_url ? (
                      <img
                        src={team.logo_url}
                        className="h-full w-full rounded-full object-cover"
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
          </TabsContent>

          <TabsContent value="rules" className="mt-8">
            <Card className="bg-zinc-900/30 border-white/5">
              <CardContent className="p-8 text-zinc-300 leading-relaxed whitespace-pre-line">
                {tournament.tournament_description ||
                  "No description provided."}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
