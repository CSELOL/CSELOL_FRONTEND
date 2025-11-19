import { Link } from "react-router-dom";
import { Trophy, Users, TrendingUp, Swords, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Data for Sponsors
const sponsors = [
  { name: "Logitech G", logo: "LOGITECH" },
  { name: "Red Bull", logo: "RED BULL" },
  { name: "Secretlab", logo: "SECRETLAB" },
  { name: "Twitch", logo: "TWITCH" },
  { name: "Discord", logo: "DISCORD" },
];

// Mock Data for Teams
const teams = [
  {
    id: 1,
    name: "Sergipe Slayers",
    tag: "SE-SLY",
    wins: 12,
    losses: 2,
    winRate: "85%",
    kda: "4.2",
    rank: 1,
    color: "text-emerald-400", // Rank 1 Color
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/50",
  },
  {
    id: 2,
    name: "Aracaju Void",
    tag: "AJU-V",
    wins: 10,
    losses: 4,
    winRate: "71%",
    kda: "3.8",
    rank: 2,
    color: "text-blue-400", // Rank 2 Color
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: 3,
    name: "Itabaiana Saints",
    tag: "ITA-ST",
    wins: 9,
    losses: 5,
    winRate: "64%",
    kda: "3.1",
    rank: 3,
    color: "text-purple-400", // Rank 3 Color
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
];

export function FeaturedTeams() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-20">
      {/* --- Background Elements --- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50 pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        {/* --- 1. Sponsors Strip --- */}
        <div className="mb-20 flex flex-col items-center gap-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
            Official Tournament Partners
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
            {/* Replace these text placeholders with actual SVGs/Images later */}
            {sponsors.map((s, i) => (
              <div
                key={i}
                className="text-xl font-black tracking-tighter text-zinc-500 hover:text-white cursor-default"
              >
                {s.logo}
              </div>
            ))}
          </div>
        </div>

        {/* --- 2. Section Header --- */}
        <div className="mb-12 flex items-end justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Top Contenders
            </h2>
            <p className="mt-2 text-zinc-400">
              The region's elite squads fighting for the Season 5 title.
            </p>
          </div>
          <Button
            variant="ghost"
            className="hidden text-primary hover:text-primary hover:bg-primary/10 md:flex"
            asChild
          >
            <Link to="/teams">
              View All Teams <Users className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* --- 3. Teams Grid --- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Render Top 3 Teams */}
          {teams.map((team) => (
            <div
              key={team.id}
              className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl ${team.borderColor} hover:border-opacity-100 border-white/5`}
            >
              {/* Rank Badge */}
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className={`${team.bgColor} ${team.color} border-0 font-mono font-bold`}
                >
                  #{team.rank}
                </Badge>
              </div>

              {/* Team Logo / Initials */}
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 ${team.bgColor} ${team.color} text-2xl font-black shadow-inner`}
              >
                {team.tag.substring(0, 1)}
              </div>

              {/* Team Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                  {team.name}
                </h3>
                <span className="text-sm font-semibold text-zinc-500">
                  {team.tag}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <TrendingUp className="h-3 w-3" /> Win Rate
                  </div>
                  <span className="font-mono text-lg font-bold text-white">
                    {team.winRate}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Swords className="h-3 w-3" /> KDA
                  </div>
                  <span className={`font-mono text-lg font-bold ${team.color}`}>
                    {team.kda}
                  </span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 -z-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20 ${team.bgColor}`}
              />
            </div>
          ))}

          {/* --- 4. "Your Team" Card (CTA) --- */}
          <Link
            to="/register"
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-zinc-500 transition-colors group-hover:bg-primary group-hover:text-black">
              <Plus className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Your Team Here
            </h3>
            <p className="mb-6 text-sm text-zinc-400">
              Registration closes in 3 days. Secure your slot now.
            </p>
            <Button className="w-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
              Register Now
            </Button>
          </Link>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden">
          <Button variant="outline" className="w-full border-white/10" asChild>
            <Link to="/teams">View All Teams</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
