import { useState, useEffect } from "react";
import { Trophy, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bracket } from "@/components/tournament/bracket";
import { toast } from "sonner";
import axios from "axios";
import { generateBracketAPI } from "@/api/matches";

// Helper to transform API data for the Visual Component
const transformMatchesToBracket = (apiMatches: any[]) => {
  const roundNames = ["Quarterfinals", "Semifinals", "Grand Finals"];

  // Find max round to know how many columns to show
  const maxRound = Math.max(...apiMatches.map((m) => m.round), 0);

  const rounds = [];
  for (let i = 1; i <= maxRound; i++) {
    const roundMatches = apiMatches
      .filter((m) => m.round === i)
      .sort((a, b) => a.match_index - b.match_index);
    rounds.push({
      name: roundNames[i - 1] || `Round ${i}`,
      matches: roundMatches.map((m) => ({
        id: m.id.toString(),
        status: m.status,
        date: m.match_date,
        team1: {
          name: m.team1_name || "TBD",
          tag: m.team1_tag,
          score: m.score1,
          isWinner: m.winner_id && m.winner_id === m.team1_id,
        },
        team2: {
          name: m.team2_name || "TBD",
          tag: m.team2_tag,
          score: m.score2,
          isWinner: m.winner_id && m.winner_id === m.team2_id,
        },
      })),
    });
  }
  return rounds;
};

export function TournamentBracketManager({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [matches, setMatches] = useState<any[]>([]);
  const [rawMatches, setRawMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatches = async () => {
    try {
      // Adjust URL based on your API structure. Assuming a generic match fetcher for now or specific endpoint
      // You might need to add a 'getMatches' by tournament endpoint if not exists
      // Ideally: GET /api/tournaments/:id/matches
      // Current backend provided allows generic match fetch, we might need to filter on client or add endpoint
      const res = await generateBracketAPI(tournamentId);
      // Note: You need to implement this endpoint or reuse generic one with filter
      // For now, assume the refactor in step 2.1 works generically
      // If you don't have that route, use: axios.get(`http://localhost:3000/api/matches?tournamentId=${tournamentId}`)

      setRawMatches(res.data);
      const data = Array.isArray(res) ? res : [];
      setMatches(transformMatchesToBracket(data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Use the helper function instead of raw axios
      await generateBracketAPI(tournamentId);

      toast.success("Bracket generated successfully!");
      fetchMatches();
    } catch (error) {
      console.error(error);
      toast.error("Could not generate bracket.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch on load
  // useEffect(() => { fetchMatches(); }, [tournamentId]);

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10 rounded-lg bg-zinc-900/30">
        <Trophy className="h-12 w-12 text-zinc-600 mb-4" />
        <h3 className="text-lg font-medium text-white">No Matches Scheduled</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Generate a bracket from the registered teams to start.
        </p>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Generate Bracket
        </Button>
      </div>
    );
  }

  // We need to patch Bracket component to accept "rounds" prop if it doesn't already.
  // Assuming your Bracket component accepts `rounds` data injection.
  // If your Bracket component is static, you need to modify it to accept props.
  return (
    <div className="space-y-6">
      {/* Re-using your Bracket component. Make sure to update it to accept `rounds={matches}` */}
      {/* <Bracket rounds={matches} />  <-- You need to implement this prop in Bracket.tsx */}
      <div className="text-zinc-500 text-center">
        Bracket Visualizer Loaded ({rawMatches.length} matches)
      </div>
    </div>
  );
}
