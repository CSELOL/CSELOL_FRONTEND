import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, Users, Trophy, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTournamentDialog } from "@/components/dashboard/admin/create-tournament-dialog";

// Mock Data
const tournaments = [
  { id: 1, name: "Season 5 - Split 1", status: "LIVE", date: "May 15", prize: "R$ 5.000", teams: 8, maxTeams: 16 },
  { id: 2, name: "Community Cup #4", status: "OPEN", date: "June 01", prize: "RP Points", teams: 12, maxTeams: 32 },
  { id: 3, name: "Season 4 Finals", status: "ENDED", date: "Jan 10", prize: "R$ 10.000", teams: 16, maxTeams: 16 },
];

export function AdminTournamentsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Tournament Management</h1>
          <p className="text-zinc-400">Create and organize competitive events.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold">
          <Plus className="mr-2 h-4 w-4" /> Create Tournament
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-lg border border-white/5">
        <Search className="h-5 w-5 text-zinc-500 ml-2" />
        <Input placeholder="Search tournaments..." className="border-0 bg-transparent focus-visible:ring-0 text-white" />
      </div>

      <div className="grid gap-4">
        {tournaments.map((t) => (
          <Card key={t.id} className="bg-zinc-900/40 border-white/10 hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded bg-zinc-800 flex items-center justify-center border border-white/5">
                  <Trophy className="h-6 w-6 text-zinc-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">
                    <Link to={`/admin/tournaments/${t.id}`} className="hover:underline decoration-red-500 underline-offset-4">
                      {t.name}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.date}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {t.teams}/{t.maxTeams} Teams</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className={
                  t.status === "LIVE" ? "border-red-500 text-red-500 bg-red-500/10" :
                  t.status === "OPEN" ? "border-emerald-500 text-emerald-500 bg-emerald-500/10" :
                  "border-zinc-500 text-zinc-500"
                }>
                  {t.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white">
                    <DropdownMenuItem asChild><Link to={`/admin/tournaments/${t.id}`}>Manage Event</Link></DropdownMenuItem>
                    <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 hover:text-red-300">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <CreateTournamentDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}