import { useState, useEffect } from "react";
import {
  Loader2,
  Shield,
  AlertTriangle,
  Crown,
  Copy,
  Check,
  RefreshCw,
  Settings,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getMyTeamAPI,
  getTeamMembersAPI,
  refreshTeamInviteCodeAPI,
  transferTeamOwnershipAPI,
  type TeamMember,
} from "@/api/teams";
import { useAuth } from "@/providers/auth-provider";
import { CreateTeamDialog } from "@/components/dashboard/create-team-dialog";
import { JoinTeamDialog } from "@/components/dashboard/join-team-dialog";
import { toast } from "sonner";

export function MyTeamPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // Transfer Ownership Logic
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedNewCaptain, setSelectedNewCaptain] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState(false);

  // Copy Invite Code Logic
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyCode = () => {
    if (team?.invite_code) {
      navigator.clipboard.writeText(team.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshCode = async () => {
    if (!team) return;
    setIsRefreshing(true);
    try {
      const res = await refreshTeamInviteCodeAPI(team.id);
      setTeam((prev: any) => ({ ...prev, invite_code: res.invite_code }));
      toast.success("Código de convite atualizado");
    } catch (error) {
      console.error("Failed to refresh code", error);
      toast.error("Falha ao atualizar código");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!selectedNewCaptain || !team) return;
    setIsTransferring(true);
    try {
      await transferTeamOwnershipAPI(team.id, selectedNewCaptain);
      toast.success("Liderança transferida com sucesso");
      setIsTransferOpen(false);
      // Reload data to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Failed to transfer ownership", error);
      toast.error("Falha ao transferir liderança");
    } finally {
      setIsTransferring(false);
    }
  };

  const isCaptain = team?.captain_id === user?.id;

  // Debugging Roles
  useEffect(() => {
    if (team) {
      console.log("--- Role Debug ---");
      console.log("My User ID:", user?.id);
      console.log("Team Captain ID:", team.captain_id);
      console.log("Is Captain?", isCaptain);
      console.log("------------------");
    }
  }, [team, isCaptain]);

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
        <Loader2 className="h-8 w-8 animate-spin mx-auto" /> Carregando...
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
          <h2 className="text-3xl font-bold text-white">Time Não Encontrado</h2>
          <p className="text-zinc-400 max-w-md mt-2">
            Você não faz parte de nenhum time ainda. Crie sua própria organização ou
            peça um código de convite a um capitão.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="lg"
            className="bg-primary font-bold text-primary-foreground"
          >
            Criar Time
          </Button>
          <Button
            onClick={() => setIsJoinOpen(true)}
            variant="outline"
            size="lg"
            className="border-white/10 text-white"
          >
            Entrar em Time
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
              <span>{members.length} Membros</span>
              {isCaptain && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/50 hover:bg-yellow-500/30">
                    Você é o Capitão
                  </Badge>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Status */}
      {team.status === "PENDING" && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 flex items-center gap-4 text-yellow-200">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-bold">Aguardando Aprovação</p>
            <p className="text-sm opacity-80">
              Seu time está sob análise. Inscrições em torneios estão
              bloqueadas.
            </p>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-zinc-900 border border-white/10">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Roster */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Elenco Ativo</h3>
                {/* Invite Code Widget */}
                <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-full px-1 py-1 pr-3">
                  <div className="bg-zinc-800 rounded-full px-2 py-1 text-xs text-zinc-400 font-mono">
                    CÓDIGO
                  </div>
                  <span className="text-sm font-bold text-white font-mono tracking-wider">
                    {team.invite_code || "Gerando..."}
                  </span>
                  <button
                    onClick={copyCode}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  {isCaptain && (
                    <button
                      onClick={handleRefreshCode}
                      disabled={isRefreshing}
                      className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                      title="Refresh Code"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-zinc-900/30 overflow-hidden">
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 ${
                      index !== members.length - 1
                        ? "border-b border-white/5"
                        : ""
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
                    Nenhum membro encontrado.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-white/10 bg-zinc-900/30">
                <h3 className="text-zinc-400 text-sm font-bold uppercase mb-4">
                  Sobre o Time
                </h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  {team.description || "Nenhuma biografia disponível."}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      Transferir Liderança
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Transfira seu cargo de capitão para outro membro.
                    </p>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-sm text-red-200">
                  <p className="font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Aviso
                  </p>
                  <p className="mt-1 opacity-90">
                    Esta ação é irreversível. Uma vez que você transfira a liderança, 
                    você se tornará um membro regular e perderá todos os privilégios
                    de capitão.
                  </p>
                </div>

                <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={!isCaptain}
                      className="w-full sm:w-auto"
                    >
                      Transferir Liderança
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>Transferir Liderança do Time</DialogTitle>
                      <DialogDescription className="text-zinc-400">
                        Selecione o novo capitão da lista abaixo.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <label className="text-sm font-medium text-zinc-300 mb-2 block">
                        Novo Capitão
                      </label>
                      <Select
                        onValueChange={setSelectedNewCaptain}
                        value={selectedNewCaptain}
                      >
                        <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                          <SelectValue placeholder="Selecione um membro" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                          {members
                            .filter((m) => m.user_id !== user?.id)
                            .map((member) => (
                              <SelectItem
                                key={member.user_id}
                                value={member.user_id}
                              >
                                {member.nickname}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setIsTransferOpen(false)}
                        className="text-zinc-400 hover:text-white"
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleTransferOwnership}
                        disabled={!selectedNewCaptain || isTransferring}
                      >
                        {isTransferring ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Transferindo...
                          </>
                        ) : (
                          "Confirmar Transferência"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
