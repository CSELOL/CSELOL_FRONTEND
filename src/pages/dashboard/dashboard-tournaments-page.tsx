import { useState } from "react";
import { Calendar, Trophy, Users, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

// Mock Data (Same structure as before, but for internal use)
const availableTournaments = [
  { 
    id: 1, 
    name: "Season 5 - Split 1", 
    status: "OPEN", 
    date: "May 15", 
    prize: "R$ 5.000", 
    slots: "8/16",
    minRank: "Open"
  },
  { 
    id: 2, 
    name: "Community Cup #4", 
    status: "FULL", 
    date: "June 01", 
    prize: "RP Points", 
    slots: "32/32",
    minRank: "Gold+"
  }
];

export function DashboardTournamentsPage() {
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  // Mock User State (Captain check)
  const hasTeam = true; // Toggle this to test "No Team" state
  
  // Mock Roster Data
  const myTeamRoster = [
    { id: "p1", name: "FakerSE", role: "Mid" },
    { id: "p2", name: "Titan", role: "Top" },
    { id: "p3", name: "Caju", role: "Jungle" },
    { id: "p4", name: "Viper", role: "ADC" },
    { id: "p5", name: "King", role: "Support" },
    { id: "p6", name: "Reserva1", role: "Sub" },
  ];

  const handleSignUpClick = (t: any) => {
    setSelectedTournament(t);
    setIsRegisterOpen(true);
  };

  const togglePlayer = (id: string) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== id));
    } else {
      if (selectedPlayers.length < 5) {
        setSelectedPlayers([...selectedPlayers, id]);
      }
    }
  };

  const processRegistration = () => {
    // API Call would go here
    alert(`Registered for ${selectedTournament.name} with ${selectedPlayers.length} players.`);
    setIsRegisterOpen(false);
  };

  if (!hasTeam) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="h-20 w-20 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10">
            <Users className="h-10 w-10 text-zinc-500" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-white">No Team Found</h2>
            <p className="text-zinc-400 max-w-md mt-2">
                You must be the captain of a registered team to sign up for tournaments.
            </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground font-bold">
            <Link to="/dashboard">Create a Team</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-bold text-white">Available Events</h1>
        <p className="text-zinc-400">Select a tournament to register your squad.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableTournaments.map((t) => (
            <Card key={t.id} className="bg-zinc-900/50 border-white/10 flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                        <Badge className={t.status === "OPEN" ? "bg-emerald-500" : "bg-zinc-700"}>
                            {t.status}
                        </Badge>
                        <span className="text-xs font-mono text-zinc-500">{t.date}</span>
                    </div>
                    <CardTitle className="text-white">{t.name}</CardTitle>
                    <CardDescription>Prize: {t.prize}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" /> {t.slots} Teams
                        </div>
                        <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" /> {t.minRank}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        onClick={() => handleSignUpClick(t)} 
                        disabled={t.status !== "OPEN"}
                        className="w-full bg-primary text-primary-foreground font-bold"
                    >
                        {t.status === "OPEN" ? "Select Roster" : "Closed"}
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>

      {/* --- ROSTER SELECTION MODAL --- */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Register for {selectedTournament?.name}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Select your active roster (Min 5 Players).
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {myTeamRoster.map((player) => {
                            const isSelected = selectedPlayers.includes(player.id);
                            return (
                                <div 
                                    key={player.id}
                                    onClick={() => togglePlayer(player.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                        isSelected 
                                            ? 'bg-primary/10 border-primary text-white' 
                                            : 'bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800'
                                    }`}
                                >
                                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-zinc-600'}`}>
                                        {isSelected && <CheckCircle2 className="h-3 w-3 text-black" />}
                                    </div>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-zinc-800 text-xs">{player.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{player.name}</span>
                                        <span className="text-[10px] uppercase">{player.role}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Agreements */}
                    <div className="flex items-start space-x-2 pt-2">
                        <Checkbox id="terms" className="border-white/20 mt-1" />
                        <Label htmlFor="terms" className="text-xs text-zinc-400 leading-relaxed">
                            I confirm my team is ready. Check-in required 15m before start.
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={processRegistration} 
                        disabled={selectedPlayers.length !== 5}
                        className="bg-primary text-primary-foreground font-bold"
                    >
                        Confirm Registration
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  );
}