import * as React from "react";
import { UserPlus, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { CreateTeamDialog } from "@/components/dashboard/create-team-dialog";
import { JoinTeamDialog } from "@/components/dashboard/join-team-dialog";

export function DashboardPage() {
  const { user } = useAuth();

  // Mock state for team membership (change to true to test "Has Team" view)
  const hasTeam = false;

  // Modal States
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showJoinModal, setShowJoinModal] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome, {user?.firstName || "Summoner"}
          </h1>
          <p className="text-zinc-400">
            Manage your team and upcoming matches.
          </p>
        </div>
      </div>

      {/* --- SCENARIO 1: NO TEAM (Onboarding) --- */}
      {!hasTeam && (
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12 mt-10">
          {/* Option A: Create Team */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/50 p-1 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex h-full flex-col justify-between bg-background/40 p-8 backdrop-blur-sm rounded-lg">
              <div className="mb-6">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Trophy className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Create a Team</h3>
                <p className="mt-2 text-zinc-400">
                  Become a Captain. Register a new organization, invite players,
                  and manage your roster.
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold group-hover:scale-[1.02] transition-transform"
              >
                Create New Team <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Option B: Join Team */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/50 p-1 transition-all hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex h-full flex-col justify-between bg-background/40 p-8 backdrop-blur-sm rounded-lg">
              <div className="mb-6">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <UserPlus className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Join a Team</h3>
                <p className="mt-2 text-zinc-400">
                  Got an invite code? Enter it here to join an existing squad
                  and start competing.
                </p>
              </div>
              <Button
                onClick={() => setShowJoinModal(true)}
                variant="outline"
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white h-12 text-base font-bold group-hover:scale-[1.02] transition-transform"
              >
                Enter Invite Code
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- SCENARIO 2: HAS TEAM (Mockup) --- */}
      {hasTeam && (
        <div className="rounded-lg border border-dashed border-white/20 p-10 text-center">
          <h2 className="text-xl font-semibold text-white">
            Team Dashboard Active
          </h2>
          <p className="text-zinc-400">We will build this section next.</p>
        </div>
      )}

      {/* --- Modals --- */}
      <CreateTeamDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
      <JoinTeamDialog open={showJoinModal} onOpenChange={setShowJoinModal} />
    </div>
  );
}
