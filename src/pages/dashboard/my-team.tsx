import { useState, useEffect } from "react";
import {
  Loader2,
  Shield,
  AlertTriangle,
  Crown,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getMyTeamAPI, getTeamMembersAPI, type TeamMember } from "@/api/teams";
import { CreateTeamDialog } from "@/components/dashboard/create-team-dialog";
import { JoinTeamDialog } from "@/components/dashboard/join-team-dialog";

export function MyTeamPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // Copy Invite Code Logic
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    if (team?.invite_code) {
      navigator.clipboard.writeText(team.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Team
        const teamData = await getMyTeamAPI();
        setTeam(teamData);

        // 2. If team exists, fetch roster
        if (teamData && teamData.id) {
          const rosterData = await getTeamMembersAPI(teamData.id);
          setMembers(rosterData);
        }
      } catch (error) {
        console.error("Error loading team data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="pt-20 text-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" /> Loading...
      </div>
    );
  }

  // --- STATE 1: NO TEAM (Onboarding) ---
  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
        <div className="h-24 w-24 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10">
          <Shield className="h-10 w-10 text-zinc-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">No Team Found</h2>
          <p className="text-zinc-400 max-w-md mt-2">
            You are not part of any team yet. Create your own organization or
            ask a captain for an invite code.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="lg"
            className="bg-primary font-bold text-primary-foreground"
          >
            Create Team
          </Button>
          <Button
            onClick={() => setIsJoinOpen(true)}
            variant="outline"
            size="lg"
            className="border-white/10 text-white"
          >
            Join Team
          </Button>
        </div>

        <CreateTeamDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        <JoinTeamDialog open={isJoinOpen} onOpenChange={setIsJoinOpen} />
      </div>
    );
  }

  // --- STATE 2: HAS TEAM (Dashboard) ---
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Team Header */}
      <div className="relative h-48 w-full rounded-xl border border-white/10 bg-black overflow-hidden">
        {/* Background Blur of Logo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110"
          style={{
            backgroundImage: team.logo_url
              ? `url(${team.logo_url})`
              : undefined,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-6 left-6 flex items-end gap-6">
          <div className="h-24 w-24 rounded-xl bg-black border-2 border-white/10 overflow-hidden flex items-center justify-center">
            {team.logo_url ? (
              <img
                src={team.logo_url}
                alt="Logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-zinc-600">
                {team.tag}
              </span>
            )}
          </div>
          <div className="mb-2">
            <h1 className="text-4xl font-black text-white uppercase">
              {team.name}
            </h1>
            <p className="text-zinc-400 flex items-center gap-3">
              <span className="text-primary font-bold">[{team.tag}]</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span>{members.length} Members</span>
            </p>
          </div>
        </div>
      </div>

      {/* Admin Status */}
      {team.status === "PENDING" && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 flex items-center gap-4 text-yellow-200">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-bold">Waiting for Approval</p>
            <p className="text-sm opacity-80">
              Your team is currently under review. Tournament signups are
              locked.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Roster */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Active Roster</h3>
            {/* Invite Code Widget */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-full px-1 py-1 pr-3">
              <div className="bg-zinc-800 rounded-full px-2 py-1 text-xs text-zinc-400 font-mono">
                CODE
              </div>
              <span className="text-sm font-bold text-white font-mono tracking-wider">
                {team.invite_code || "Generating..."}
              </span>
              <button
                onClick={copyCode}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-zinc-900/30 overflow-hidden">
            {members.map((member, index) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-4 ${
                  index !== members.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar_url || ""} />
                    <AvatarFallback className="bg-zinc-800 text-zinc-500">
                      {member.nickname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">
                        {member.nickname}
                      </span>
                      {member.team_role === "CAPTAIN" && (
                        <Crown className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 uppercase">
                      {member.primary_role || "Flex"}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-white/10 text-zinc-400 bg-black/20"
                >
                  {member.team_role}
                </Badge>
              </div>
            ))}
            {members.length === 0 && (
              <div className="p-8 text-center text-zinc-500">
                No members found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-white/10 bg-zinc-900/30">
            <h3 className="text-zinc-400 text-sm font-bold uppercase mb-4">
              About Team
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm">
              {team.description || "No biography available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
