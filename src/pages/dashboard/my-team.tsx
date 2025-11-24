import * as React from "react";
import {
  Users,
  Copy,
  Check,
  MoreVertical,
  Shield,
  Swords,
  Settings,
  UserMinus,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

// Mock Data
const teamData = {
  name: "Sergipe Slayers",
  tag: "SLY",
  inviteCode: "SLY-8823-X9",
  stats: { wins: 12, losses: 2, ranking: 1 },
  members: [
    {
      id: 1,
      name: "FakerSE",
      role: "Captain",
      position: "Mid",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: 2,
      name: "TitanLagarto",
      role: "Member",
      position: "Top",
      avatar: null,
    },
    {
      id: 3,
      name: "CajuJungle",
      role: "Member",
      position: "Jungle",
      avatar: null,
    },
    {
      id: 4,
      name: "ViperAracaju",
      role: "Member",
      position: "ADC",
      avatar: null,
    },
    {
      id: 5,
      name: "SupportKing",
      role: "Member",
      position: "Support",
      avatar: null,
    },
  ],
};

export function MyTeamPage() {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(teamData.inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- 1. Team Header --- */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-card/50 p-8 backdrop-blur-sm">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: Identity */}
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl">
              <span className="text-3xl font-black text-primary">
                {teamData.tag}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">
                  {teamData.name}
                </h1>
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary bg-primary/5"
                >
                  Season 5 Confirmed
                </Badge>
              </div>
              <p className="text-zinc-400 mt-1 flex items-center gap-4">
                <span>Region: Sergipe</span>
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                <span>Est. 2024</span>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button className="bg-primary text-primary-foreground font-bold hover:bg-primary/90">
              <Swords className="mr-2 h-4 w-4" /> Find Scrim
            </Button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6 md:grid-cols-4">
          <div>
            <span className="text-xs font-bold uppercase text-zinc-500">
              Win Rate
            </span>
            <div className="text-2xl font-mono font-bold text-white">85%</div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-zinc-500">
              Matches
            </span>
            <div className="text-2xl font-mono font-bold text-white">
              {teamData.stats.wins + teamData.stats.losses}
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-zinc-500">
              Current Streak
            </span>
            <div className="text-2xl font-mono font-bold text-emerald-400">
              W5
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-zinc-500">
              Ranking
            </span>
            <div className="text-2xl font-mono font-bold text-primary">
              #{teamData.stats.ranking}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* --- 2. Main Roster (Left - Wide) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Active Roster
            </h2>
            <span className="text-sm text-zinc-500">
              {teamData.members.length} / 7 Players
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-card/30 overflow-hidden">
            {teamData.members.map((member, index) => (
              <div key={member.id}>
                <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={member.avatar || ""} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs font-bold">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name & Role */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {member.name}
                        </span>
                        {member.role === "Captain" && (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {member.position}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Dropdown) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 text-zinc-400"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-950 border-white/10 text-zinc-300"
                    >
                      <DropdownMenuLabel>Manage Player</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
                        View Profile
                      </DropdownMenuItem>
                      {member.role !== "Captain" && (
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 hover:text-red-400">
                          <UserMinus className="mr-2 h-4 w-4" /> Kick Player
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {index < teamData.members.length - 1 && (
                  <Separator className="bg-white/5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- 3. Sidebar Widgets (Right - Narrow) --- */}
        <div className="space-y-6">
          {/* Invite Code Widget */}
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6">
            <h3 className="text-sm font-bold uppercase text-primary mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Invite Code
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Share this code with your teammates. They can use it to join the
              roster automatically.
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 rounded bg-zinc-950 border border-white/10 px-3 py-2 font-mono text-sm font-bold text-white text-center tracking-widest">
                {teamData.inviteCode}
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={copyCode}
                className="border-white/10 bg-zinc-900 hover:bg-zinc-800 shrink-0"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Upcoming Match Mini-Widget */}
          <div className="rounded-xl border border-white/10 bg-card/30 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Next Match</h3>
            <div className="rounded-lg bg-zinc-950/50 p-4 border border-white/5 text-center">
              <div className="text-xs text-zinc-500 mb-2">
                Quarterfinals • May 15
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="font-bold text-white">SLY</span>
                <span className="text-xs text-zinc-600">VS</span>
                <span className="font-bold text-white">AJU</span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="w-full h-7 text-xs"
              >
                View Lobby
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
