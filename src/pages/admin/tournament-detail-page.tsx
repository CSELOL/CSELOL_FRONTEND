import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Settings, Users, Trophy, Calendar, CheckCircle2, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MatchEditorDialog } from "@/components/dashboard/match-editor-dialog"; // Ensure this path is correct

export function AdminTournamentDetailPage() {
  const { id } = useParams();
  const [isMatchEditorOpen, setIsMatchEditorOpen] = useState(false);

  // Mock Data
  const pendingTeams = [
    { id: 1, name: "Lagarto Kings", captain: "TitanLGT", members: 5, status: "Pending" },
    { id: 2, name: "Barra Bulls", captain: "BullMaster", members: 6, status: "Pending" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/tournaments"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Season 5 - Split 1
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Open</Badge>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Tournament ID: #{id}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="border-white/10 text-zinc-400 hover:text-white">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="bg-zinc-900 border border-white/5 w-full justify-start h-12 p-1">
          <TabsTrigger value="overview" className="h-10 px-6">Overview</TabsTrigger>
          <TabsTrigger value="teams" className="h-10 px-6">Teams & Approvals</TabsTrigger>
          <TabsTrigger value="bracket" className="h-10 px-6">Bracket & Matches</TabsTrigger>
        </TabsList>

        {/* Teams Tab */}
        <TabsContent value="teams" className="mt-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Registration Queue</CardTitle>
              <CardDescription>Review and approve team applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead>Team Name</TableHead>
                    <TableHead>Captain</TableHead>
                    <TableHead>Roster</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTeams.map((team) => (
                    <TableRow key={team.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-bold text-white">{team.name}</TableCell>
                      <TableCell className="text-zinc-300">{team.captain}</TableCell>
                      <TableCell className="text-zinc-400">{team.members}/7</TableCell>
                      <TableCell><Badge variant="outline" className="text-yellow-500 border-yellow-500/20">Pending</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" className="border-white/10 hover:bg-red-500/10 text-red-500"><XCircle className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bracket Tab */}
        <TabsContent value="bracket" className="mt-6 space-y-6">
          <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-lg border border-white/10">
            <div>
              <h3 className="text-white font-bold">Match Schedule</h3>
              <p className="text-xs text-zinc-400">Create matches manually or generate bracket.</p>
            </div>
            <Button onClick={() => setIsMatchEditorOpen(true)} className="bg-primary font-bold text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Create Match
            </Button>
          </div>
          
          {/* Placeholder for Match List */}
          <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-lg bg-zinc-900/20">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No active matches. Start by generating a bracket.</p>
          </div>
        </TabsContent>
      </Tabs>

      <MatchEditorDialog 
        open={isMatchEditorOpen} 
        onOpenChange={setIsMatchEditorOpen}
        availableTeams={[{id: '1', name: 'Lagarto Kings'}]} // Mock
      />
    </div>
  );
}