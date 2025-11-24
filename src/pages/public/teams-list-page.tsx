import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Trophy, Shield, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data
const allTeams = [
  { id: 1, name: "Sergipe Slayers", tag: "SLY", members: 5, wins: 12, losses: 2, rank: 1, logo: null, status: "Verified" },
  { id: 2, name: "Aracaju Void", tag: "AJU", members: 6, wins: 10, losses: 4, rank: 2, logo: null, status: "Verified" },
  { id: 3, name: "Lagarto Kings", tag: "LGT", members: 5, wins: 6, losses: 8, rank: 5, logo: null, status: "Active" },
  { id: 4, name: "Itabaiana Saints", tag: "ITA", members: 5, wins: 9, losses: 5, rank: 3, logo: null, status: "Verified" },
  { id: 5, name: "Estância Eagles", tag: "EST", members: 7, wins: 8, losses: 6, rank: 4, logo: null, status: "Active" },
  { id: 6, name: "Propriá Punks", tag: "PRP", members: 5, wins: 5, losses: 9, rank: 6, logo: null, status: "Active" },
  { id: 7, name: "Barra Bulls", tag: "BAR", members: 5, wins: 3, losses: 11, rank: 8, logo: null, status: "New" },
  { id: 8, name: "Socorro Spirits", tag: "SOC", members: 5, wins: 3, losses: 11, rank: 7, logo: null, status: "New" },
];

export function TeamsListPage() {
  const [search, setSearch] = useState("");

  // Filter Logic
  const filteredTeams = allTeams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container max-w-6xl px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Active Teams</h1>
                <p className="text-zinc-400">Browse all organizations registered for Season 5.</p>
            </div>
            
            {/* Search Bar */}
            <div className="flex w-full md:w-auto items-center space-x-2">
                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input 
                        placeholder="Search by name or tag..." 
                        className="pl-9 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="border-white/10 text-zinc-400 hover:text-white">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                    <Link to={`/teams/${team.id}`} key={team.id}>
                        <Card className="bg-zinc-900/40 border-white/5 hover:border-primary/50 hover:bg-zinc-900/80 transition-all duration-300 group cursor-pointer overflow-hidden relative">
                            
                            {/* Top Decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-primary/50" />
                            
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="h-16 w-16 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <span className="text-xl font-black text-zinc-700 group-hover:text-primary transition-colors">
                                        {team.tag[0]}
                                    </span>
                                </div>
                                <Badge variant="outline" className={`border-0 ${
                                    team.status === "Verified" ? "bg-primary/10 text-primary" : 
                                    team.status === "New" ? "bg-blue-500/10 text-blue-400" : "bg-zinc-800 text-zinc-500"
                                }`}>
                                    {team.status}
                                </Badge>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors truncate">
                                        {team.name}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-mono tracking-wider">
                                        [{team.tag}]
                                    </p>
                                </div>

                                {/* Mini Stats Grid */}
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
                                            <Trophy className="h-3 w-3" /> Rank
                                        </span>
                                        <span className="text-sm font-bold text-white">#{team.rank}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-1">
                                            <Users className="h-3 w-3" /> Size
                                        </span>
                                        <span className="text-sm font-bold text-white">{team.members}/7</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))
            ) : (
                <div className="col-span-full py-20 text-center">
                    <Shield className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white">No teams found</h3>
                    <p className="text-zinc-500">Try searching for a different name or tag.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}