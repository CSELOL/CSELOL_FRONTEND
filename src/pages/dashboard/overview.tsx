import * as React from "react";
import { UserPlus, Trophy, ArrowRight, Shield, Calendar, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { CreateTeamDialog } from "@/components/dashboard/create-team-dialog";
import { JoinTeamDialog } from "@/components/dashboard/join-team-dialog";
import {
  getMyTeamAPI,
  getMyTeamMatchesAPI,
  getMyTeamTournamentsAPI,
} from "@/api/teams";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export function DashboardPage() {
  const { user } = useAuth();
  const [team, setTeam] = React.useState<any>(null);
  const [matches, setMatches] = React.useState<any[]>([]);
  const [tournaments, setTournaments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal States
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showJoinModal, setShowJoinModal] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const myTeam = await getMyTeamAPI();
        setTeam(myTeam);

        if (myTeam) {
          const [myMatches, myTournaments] = await Promise.all([
            getMyTeamMatchesAPI(),
            getMyTeamTournamentsAPI(),
          ]);
          setMatches(myMatches);
          setTournaments(myTournaments);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div className="text-white">Carregando painel...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Bem-vindo, {user?.user_metadata?.nickname || user?.email?.split("@")[0] || "Invocador"}
          </h1>
          <p className="text-zinc-400">
            Gerencie seu time e próximas partidas.
          </p>
        </div>
      </div>

      {/* --- SCENARIO 1: NO TEAM (Onboarding) --- */}
      {!team && (
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12 mt-10">
          {/* Option A: Create Team */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/50 p-1 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex h-full flex-col justify-between bg-background/40 p-8 backdrop-blur-sm rounded-lg">
              <div className="mb-6">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Trophy className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Criar um Time</h3>
                <p className="mt-2 text-zinc-400">
                  Torne-se um Capitão. Registre uma nova organização, convide jogadores,
                  e gerencie seu elenco.
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold group-hover:scale-[1.02] transition-transform"
              >
                Criar Novo Time <ArrowRight className="ml-2 h-4 w-4" />
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
                <h3 className="text-2xl font-bold text-white">Entrar num Time</h3>
                <p className="mt-2 text-zinc-400">
                  Tem um código de convite? Digite aqui para se juntar a um esquadrão
                  e começar a competir.
                </p>
              </div>
              <Button
                onClick={() => setShowJoinModal(true)}
                variant="outline"
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white h-12 text-base font-bold group-hover:scale-[1.02] transition-transform"
              >
                Inserir Código de Convite
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- SCENARIO 2: HAS TEAM (Dashboard) --- */}
      {team && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Team Card */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-lg bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                  {team.logo_url ? (
                    <img
                      src={team.logo_url}
                      alt={team.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Shield className="h-8 w-8 text-zinc-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                  <p className="text-zinc-400 font-mono">[{team.tag}]</p>
                </div>
                <div className="ml-auto">
                  <Link to="/dashboard/team">
                    <Button variant="outline" className="border-white/10">
                      Gerenciar Time
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Upcoming Matches */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" /> Próximas Partidas
              </h3>
              <div className="space-y-3">
                {matches.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-8 text-center text-zinc-500">
                    Nenhuma partida agendada.
                  </div>
                ) : (
                  matches.map((match) => (
                    <div
                      key={match.id}
                      className="rounded-xl border border-white/10 bg-zinc-900/30 p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center w-12">
                          <span className="block text-xs text-zinc-500 uppercase font-bold">
                            {format(new Date(match.start_time), "MMM")}
                          </span>
                          <span className="block text-xl font-bold text-white">
                            {format(new Date(match.start_time), "dd")}
                          </span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                          <p className="text-sm text-zinc-400">
                            {match.tournament.name} • {match.round_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-white">
                              {match.team_a.tag}
                            </span>
                            <span className="text-zinc-500 text-xs">VS</span>
                            <span className="font-bold text-white">
                              {match.team_b.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-white/10 text-zinc-400"
                      >
                        {match.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Active Tournaments */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" /> Torneios Ativos
              </h3>
              <div className="space-y-3">
                {tournaments.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-8 text-center text-zinc-500">
                    Não registrado em nenhum torneio.
                  </div>
                ) : (
                  tournaments.map((tournament) => (
                    <div
                      key={tournament.id}
                      className="rounded-xl border border-white/10 bg-zinc-900/30 p-4"
                    >
                      <h4 className="font-bold text-white">
                        {tournament.name}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          variant="secondary"
                          className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                        >
                          {tournament.status}
                        </Badge>
                        <span className="text-xs text-zinc-500">
                          {tournament.registration_status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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
