import { useState } from "react";
import {
  Trophy,
  Calendar,
  Users,
  Settings,
  CheckCircle2,
  XCircle,
  Save,
  AlertTriangle,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data: Pending Registrations
const pendingTeams = [
  {
    id: 1,
    name: "Lagarto Kings",
    captain: "TitanLGT",
    email: "titan@gmail.com",
    date: "2 hrs ago",
    status: "Pending",
  },
  {
    id: 2,
    name: "Barra Bulls",
    captain: "BullMaster",
    email: "bulls@uol.com.br",
    date: "5 hrs ago",
    status: "Pending",
  },
  {
    id: 3,
    name: "Socorro Spirits",
    captain: "Ghost",
    email: "ghost@outlook.com",
    date: "1 day ago",
    status: "Denied",
  },
];

// Mock Data: Active Matches
const activeMatches = [
  {
    id: "M-101",
    round: "Quarterfinals",
    teamA: "Sergipe Slayers",
    teamB: "Aracaju Void",
    scoreA: 0,
    scoreB: 0,
    status: "Live",
  },
  {
    id: "M-102",
    round: "Quarterfinals",
    teamA: "Propriá Punks",
    teamB: "Estância Eagles",
    scoreA: 2,
    scoreB: 1,
    status: "Finished",
  },
];

export function AdminTournamentDetailPage() {
  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <Link
              to="/admin/tournaments"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back to List
            </Link>
            <span>/</span>
            <span>Season 5</span>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Season 5 - Split 1
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              Live
            </Badge>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-white/10 text-zinc-400 hover:text-white"
          >
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
            <AlertTriangle className="mr-2 h-4 w-4" /> Emergency Pause
          </Button>
        </div>
      </div>

      {/* --- Tabs Navigation --- */}
      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-zinc-900/50 border border-white/5 w-full md:w-auto justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams & Registrations</TabsTrigger>
          <TabsTrigger value="matches">Match Management</TabsTrigger>
        </TabsList>

        {/* 1. Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Total Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">14 / 16</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Matches Played
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Next Broadcast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  Today, 20:00
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Bracket Preview</CardTitle>
                <CardDescription>
                  Quick view of the current standings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 w-full rounded bg-black/20 border border-white/5 flex items-center justify-center text-zinc-500">
                  [ Bracket Visualization Widget ]
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Broadcast Overlay</CardTitle>
                <CardDescription>Copy URL for OBS/Streamlabs.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input
                  value="https://cselol.com/overlay/s5-bracket"
                  readOnly
                  className="bg-black/20 border-white/10 font-mono text-xs"
                />
                <Button variant="secondary">Copy</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. Teams Management Tab */}
        <TabsContent value="teams" className="mt-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Registration Queue</CardTitle>
              <CardDescription>
                Approve or reject teams applying for this event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5">
                    <TableHead className="text-zinc-400">Team Name</TableHead>
                    <TableHead className="text-zinc-400">Captain</TableHead>
                    <TableHead className="text-zinc-400">Applied</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-right text-zinc-400">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTeams.map((team) => (
                    <TableRow key={team.id} className="border-white/5">
                      <TableCell className="font-bold text-white">
                        {team.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-zinc-200">{team.captain}</span>
                          <span className="text-xs text-zinc-500">
                            {team.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {team.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            team.status === "Pending"
                              ? "text-yellow-500 border-yellow-500/20"
                              : "text-red-500 border-red-500/20"
                          }
                        >
                          {team.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {team.status === "Pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Match Management Tab */}
        <TabsContent value="matches" className="mt-6">
          <div className="grid gap-6">
            {activeMatches.map((match) => (
              <div
                key={match.id}
                className="flex flex-col md:flex-row items-center justify-between rounded-lg border border-white/10 bg-card p-4"
              >
                {/* Match Info */}
                <div className="flex flex-col gap-1 mb-4 md:mb-0 w-full md:w-48">
                  <span className="text-xs font-bold uppercase text-zinc-500">
                    {match.round}
                  </span>
                  <span className="text-xs font-mono text-zinc-600">
                    ID: {match.id}
                  </span>
                  <Badge
                    className={`w-fit mt-1 ${
                      match.status === "Live"
                        ? "bg-red-500 animate-pulse"
                        : "bg-zinc-700"
                    }`}
                  >
                    {match.status}
                  </Badge>
                </div>

                {/* Score Editor */}
                <div className="flex items-center gap-4 flex-1 justify-center">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-white">{match.teamA}</span>
                    <Badge
                      variant="outline"
                      className="border-white/10 text-zinc-500 text-[10px]"
                    >
                      BLUE SIDE
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 bg-black/30 p-2 rounded border border-white/10">
                    <Input
                      type="number"
                      defaultValue={match.scoreA}
                      className="w-12 text-center bg-transparent border-0 text-xl font-bold text-white p-0 h-auto focus-visible:ring-0"
                    />
                    <span className="text-zinc-600 font-bold">:</span>
                    <Input
                      type="number"
                      defaultValue={match.scoreB}
                      className="w-12 text-center bg-transparent border-0 text-xl font-bold text-white p-0 h-auto focus-visible:ring-0"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-white">{match.teamB}</span>
                    <Badge
                      variant="outline"
                      className="border-white/10 text-zinc-500 text-[10px]"
                    >
                      RED SIDE
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-48 flex justify-end gap-2 mt-4 md:mt-0">
                  <Button
                    size="sm"
                    className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  >
                    Lobby
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground font-bold"
                  >
                    <Save className="mr-2 h-4 w-4" /> Update
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-950 border-white/10"
                    >
                      <DropdownMenuItem className="text-red-400">
                        Reset Match
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Logs</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
