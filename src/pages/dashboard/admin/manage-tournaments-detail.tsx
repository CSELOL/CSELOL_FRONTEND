import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// API
import {
  getTournamentByIdAPI,
  getTournamentTeamsAPI,
  updateRegistrationStatusAPI,
  getPaymentProofAPI,
} from "@/api/tournaments";

// Components
import { TournamentHeader } from "@/components/dashboard/admin/tournament-details/header";
import { TournamentOverviewStats } from "@/components/dashboard/admin/tournament-details/overview-stats";
import { TournamentTeamManagement } from "@/components/dashboard/admin/tournament-details/team-management";
import { TournamentSettingsForm } from "@/components/dashboard/admin/tournament-details/settings-form";
import { TournamentMatchesTab } from "@/components/dashboard/admin/tournament-details/matches-tab";
import { TournamentManagementTab } from "@/components/dashboard/admin/tournament-details/management-tab";
import { TournamentStandingsTab } from "@/components/dashboard/admin/tournament-details/standings-tab";

export function AdminTournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [tData, teamsData] = await Promise.all([
        getTournamentByIdAPI(id),
        getTournamentTeamsAPI(id),
      ]);
      setTournament(tData);
      setRegisteredTeams(teamsData);
    } catch (error) {
      console.error("Failed to fetch tournament:", error);
      toast.error("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusChange = async (
    regId: number,
    status: "APPROVED" | "REJECTED",
    reason?: string
  ) => {
    try {
      await updateRegistrationStatusAPI(regId, status, reason);
      toast.success(`Team ${status.toLowerCase()}`);
      loadData(); // Refresh list
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleViewProof = async (regId: number) => {
    try {
      const { url } = await getPaymentProofAPI(regId);
      window.open(url, "_blank");
    } catch (e) {
      toast.error("Proof not found");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  if (!tournament)
    return <div className="text-white">Tournament not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <TournamentHeader tournament={tournament} onRefresh={loadData} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-zinc-900 border border-white/5 w-full justify-start h-12 overflow-x-auto">
          <TabsTrigger value="overview" className="h-10 px-6">
            Overview
          </TabsTrigger>
          <TabsTrigger value="teams" className="h-10 px-6">
            Teams
          </TabsTrigger>
          <TabsTrigger value="standings" className="h-10 px-6">
            Standings
          </TabsTrigger>
          <TabsTrigger value="matches" className="h-10 px-6">
            Matches
          </TabsTrigger>
          <TabsTrigger value="management" className="h-10 px-6">
            Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="h-10 px-6">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <TournamentOverviewStats
            tournament={tournament}
            teamCount={registeredTeams.length}
          />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <TournamentTeamManagement
            teams={registeredTeams}
            onUpdateStatus={handleStatusChange}
            onViewProof={handleViewProof}
          />
        </TabsContent>

        <TabsContent value="standings" className="mt-6">
          <TournamentStandingsTab tournamentId={id!} />
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <TournamentMatchesTab tournamentId={id!} />
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <TournamentManagementTab tournamentId={id!} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <TournamentSettingsForm tournament={tournament} onUpdate={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
