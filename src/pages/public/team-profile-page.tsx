import { Trophy, Users, Target, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function TeamProfilePage() {
  // This would normally fetch data based on URL param :teamId
  const team = {
    name: "Sergipe Slayers",
    tag: "SLY",
    rank: 1,
    founded: "2024",
    region: "Aracaju, SE",
    wins: 42,
    losses: 8,
    members: [
      {
        name: "FakerSE",
        role: "Mid",
        kda: "5.2",
        img: "https://github.com/shadcn.png",
      },
      { name: "TitanLGT", role: "Top", kda: "3.1", img: null },
      { name: "CajuJungle", role: "Jungle", kda: "4.4", img: null },
      { name: "Viper", role: "ADC", kda: "6.0", img: null },
      { name: "KingSup", role: "Support", kda: "9.2", img: null },
    ],
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* --- Hero Banner --- */}
      <div className="container max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 p-8 md:p-12 backdrop-blur-sm">
          {/* Background Blur */}
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Logo */}
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-zinc-900 border-2 border-white/10 flex items-center justify-center shadow-2xl">
              <span className="text-4xl md:text-5xl font-black text-primary">
                {team.tag}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                    {team.name}
                  </h1>
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 text-zinc-400 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {team.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Est. {team.founded}
                  </span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
                <div>
                  <p className="text-xs font-bold uppercase text-zinc-500 mb-1">
                    Win Rate
                  </p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {Math.round((team.wins / (team.wins + team.losses)) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-zinc-500 mb-1">
                    Record
                  </p>
                  <p className="text-2xl font-mono font-bold text-white">
                    <span className="text-emerald-400">{team.wins}W</span> -{" "}
                    <span className="text-red-400">{team.losses}L</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-zinc-500 mb-1">
                    Ranking
                  </p>
                  <p className="text-2xl font-mono font-bold text-primary">
                    #{team.rank}
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div>
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/10 hover:text-white"
              >
                Challenge Team
              </Button>
            </div>
          </div>
        </div>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left: Roster */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> Active Roster
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.members.map((member) => (
                <Card
                  key={member.name}
                  className="bg-card/30 border-white/5 hover:border-white/20 transition-colors p-4 flex items-center gap-4"
                >
                  <Avatar className="h-14 w-14 border border-white/10">
                    <AvatarImage src={member.img || ""} />
                    <AvatarFallback className="bg-zinc-800 font-bold text-zinc-500">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-white text-lg">
                      {member.name}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Badge
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-400"
                      >
                        {member.role}
                      </Badge>
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Target className="h-3 w-3" /> KDA: {member.kda}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Achievements */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" /> Achievements
            </h2>
            <div className="rounded-xl border border-white/5 bg-card/30 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-white">Season 4 Champions</div>
                  <div className="text-xs text-zinc-500">1st Place • 2024</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-zinc-300">
                    Community Cup #2
                  </div>
                  <div className="text-xs text-zinc-500">
                    Semi-finalist • 2023
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
