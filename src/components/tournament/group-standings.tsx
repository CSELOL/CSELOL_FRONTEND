import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Match {
  id: number;
  teamAName: string;
  teamBName: string;
  teamAId: number;
  teamBId: number;
  scoreA: number;
  scoreB: number;
  winnerId: number | null;
  status: string;
  group_name?: string; // Assuming this exists or we infer it
}

interface Team {
  id: number;
  name: string;
  tag: string;
}

interface GroupStandingsProps {
  matches: Match[];
  teams: Team[];
}

interface TeamStats {
  id: number;
  name: string;
  played: number;
  won: number;
  lost: number;
  points: number;
}

export function GroupStandings({ matches, teams }: GroupStandingsProps) {
  // 1. Identify Groups
  // We assume matches have a 'group_name' property if they belong to a group stage.
  // If not, we might need another way to identify groups.
  // For now, let's filter matches that have a group_name.
  
  const groupMatches = matches.filter((m) => m.group_name);
  
  if (groupMatches.length === 0) {
    return null; // No group matches found
  }

  const groups = Array.from(new Set(groupMatches.map((m) => m.group_name!))).sort();

  const calculateStandings = (groupName: string) => {
    const gMatches = groupMatches.filter((m) => m.group_name === groupName);
    const stats: Record<number, TeamStats> = {};

    // Initialize stats for teams in this group
    // We need to know which teams are in which group. 
    // Usually, we'd iterate matches to find teams.
    gMatches.forEach((m) => {
      if (m.teamAId && !stats[m.teamAId]) {
        stats[m.teamAId] = { id: m.teamAId, name: m.teamAName, played: 0, won: 0, lost: 0, points: 0 };
      }
      if (m.teamBId && !stats[m.teamBId]) {
        stats[m.teamBId] = { id: m.teamBId, name: m.teamBName, played: 0, won: 0, lost: 0, points: 0 };
      }
    });

    // Calculate stats
    gMatches.forEach((m) => {
      if (m.status === "COMPLETED" && m.winnerId) {
        if (stats[m.teamAId]) stats[m.teamAId].played++;
        if (stats[m.teamBId]) stats[m.teamBId].played++;

        if (m.winnerId === m.teamAId) {
          if (stats[m.teamAId]) {
            stats[m.teamAId].won++;
            stats[m.teamAId].points += 1; // Assuming 1 point for win
          }
          if (stats[m.teamBId]) stats[m.teamBId].lost++;
        } else {
          if (stats[m.teamBId]) {
            stats[m.teamBId].won++;
            stats[m.teamBId].points += 1;
          }
          if (stats[m.teamAId]) stats[m.teamAId].lost++;
        }
      }
    });

    return Object.values(stats).sort((a, b) => b.points - a.points || b.won - a.won);
  };

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <Card key={group} className="bg-zinc-900/30 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Group {group}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Team</TableHead>
                  <TableHead className="text-zinc-400 text-center w-12">P</TableHead>
                  <TableHead className="text-zinc-400 text-center w-12">W</TableHead>
                  <TableHead className="text-zinc-400 text-center w-12">L</TableHead>
                  <TableHead className="text-zinc-400 text-center w-12 font-bold text-primary">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculateStandings(group).map((team) => (
                  <TableRow key={team.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{team.name}</TableCell>
                    <TableCell className="text-center text-zinc-400">{team.played}</TableCell>
                    <TableCell className="text-center text-green-500">{team.won}</TableCell>
                    <TableCell className="text-center text-red-500">{team.lost}</TableCell>
                    <TableCell className="text-center font-bold text-primary">{team.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
