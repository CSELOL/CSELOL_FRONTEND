import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getTournamentMatchesAPI } from "@/api/matches";
import { getTournamentTeamsAPI } from "@/api/tournaments";
import { GroupStandings } from "@/components/tournament/group-standings";
import { toast } from "sonner";

interface StandingsTabProps {
  tournamentId: string;
}

export function TournamentStandingsTab({ tournamentId }: StandingsTabProps) {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [matchesData, teamsData] = await Promise.all([
          getTournamentMatchesAPI(tournamentId),
          getTournamentTeamsAPI(tournamentId),
        ]);
        setMatches(Array.isArray(matchesData) ? matchesData : []);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (error) {
        toast.error("Failed to load standings data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  }

  const groupMatches = matches.filter((m) => m.stage === "groups");

  if (groupMatches.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500 border border-dashed border-white/10 rounded-xl">
        No group stage matches found.
      </div>
    );
  }

  return <GroupStandings matches={groupMatches} teams={teams} />;
}
