import { useState, useEffect } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Trophy,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  X,
  ArrowRight,
  Swords,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

// APIs
import {
  getTournamentsAPI,
  registerTeamForTournamentAPI,
  withdrawRegistrationAPI,
} from "@/api/tournaments";
import { getMyTeamAPI, getMyTeamTournamentsAPI } from "@/api/teams";
import { uploadPaymentProof } from "@/services/storage-service";

interface Tournament {
  id: number;
  tournament_name: string;
  status: string;
  start_date: string;
  format: string;
  allow_signups: boolean;
  is_listed: boolean;
  description?: string;
  banner_url?: string;
  logo_url?: string;
  registration_status?: string;
  rejection_reason?: string;
}

export function TournamentsHubPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myTeam, setMyTeam] = useState<any>(null);

  // ... (Registration State & Proof Upload State remain same)
  // Registration State
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Proof Upload State
  const [proofPath, setProofPath] = useState("");
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch My Team (if exists)
        let teamData = null;
        try {
          teamData = await getMyTeamAPI();
          setMyTeam(teamData);
        } catch (e) {
          console.log("No team found for user");
        }

        // 2. Fetch All Tournaments
        const tData = await getTournamentsAPI();
        const listedTournaments = tData.filter((t: any) => t.is_listed);
        setTournaments(listedTournaments);

        // 3. Fetch My Tournaments (if team exists)
        if (teamData) {
          const myT = await getMyTeamTournamentsAPI();
          setMyTournaments(myT);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      console.log("Refreshing data...");
      const teamData = await getMyTeamAPI();
      setMyTeam(teamData);

      const tData = await getTournamentsAPI();
      const listedTournaments = tData.filter((t: any) => t.is_listed);
      setTournaments(listedTournaments);

      if (teamData) {
        const myT = await getMyTeamTournamentsAPI();
        console.log("My Tournaments Fetched:", myT);
        setMyTournaments(myT);
      }
    } catch (error) {
      console.error("Failed to refresh data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (Handlers remain same: handleRegisterClick, handleProofUpload, processRegistration)
  const handleRegisterClick = (t: Tournament, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!myTeam) {
      navigate("/dashboard/team");
      return;
    }
    setSelectedTournament(t);
    setProofPath("");
    setIsRegisterOpen(true);
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProof(true);
    try {
      const path = await uploadPaymentProof(file);
      setProofPath(path);
    } catch (err) {
      toast.error("Falha ao enviar comprovante. Tente novamente.");
      console.error(err);
    } finally {
      setIsUploadingProof(false);
    }
  };

  const processRegistration = async () => {
    if (!selectedTournament) return;

    if (!proofPath) {
      toast.error("Por favor, envie um comprovante de pagamento para continuar.");
      return;
    }

    setIsRegistering(true);

    try {
      await registerTeamForTournamentAPI(selectedTournament.id, proofPath);
      toast.success("Sucesso! Seu time foi registrado. Aguardando aprovação do admin.");
      setIsRegisterOpen(false);
      if (myTeam) {
        const myT = await getMyTeamTournamentsAPI();
        setMyTournaments(myT);
      }
    } catch (error: any) {
      toast.error(error.message || "Falha ao registrar.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 text-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" /> Carregando...
      </div>
    );
  }

  // --- Derived State ---
  const activeTournament = myTournaments.find((t) =>
    ["ONGOING", "ongoing"].includes(t.status) && t.registration_status === "APPROVED"
  );

  const openTournaments = tournaments.filter(
    (t) =>
      ["open", "scheduled"].includes(t.status.toLowerCase())
  );
  const ongoingTournaments = tournaments.filter((t) =>
    ["ongoing", "live"].includes(t.status.toLowerCase())
  );
  const pastTournaments = tournaments.filter((t) =>
    ["completed", "finished", "closed"].includes(t.status.toLowerCase())
  );

  const TournamentCard = ({ t }: { t: Tournament }) => {
    const myRegistration = myTournaments.find((mt) => mt.id === t.id);
    const isRegistered = !!myRegistration;
    const status = myRegistration?.registration_status; // PENDING, APPROVED, REJECTED
    
    // DEBUG LOG
    if (isRegistered) {
      console.log(`Tournament ${t.id} status:`, status, myRegistration);
    }

    const rejectionReason = myRegistration?.rejection_reason;

    const [showReason, setShowReason] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [showDismissDialog, setShowDismissDialog] = useState(false);
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

    const handleDismissRejection = async () => {
      setIsWithdrawing(true);
      try {
        await withdrawRegistrationAPI(t.id);
        setMyTournaments((prev) => prev.filter((mt) => mt.id !== t.id));
        setShowReason(false);
        toast.success("Inscrição dispensada.");
      } catch (error) {
        console.error(error);
        toast.error("Falha ao dispensar inscrição.");
      } finally {
        setIsWithdrawing(false);
        setShowDismissDialog(false);
      }
    };

    const handleWithdraw = async () => {
      setIsWithdrawing(true);
      try {
        await withdrawRegistrationAPI(t.id);
        setMyTournaments((prev) => prev.filter((mt) => mt.id !== t.id));
        toast.success("Inscrição cancelada.");
      } catch (error) {
        console.error(error);
        toast.error("Falha ao cancelar inscrição.");
      } finally {
        setIsWithdrawing(false);
        setShowWithdrawDialog(false);
      }
    };

    return (
      <>
        <Card
          key={t.id}
          className={cn(
            "bg-zinc-900/50 border-white/10 flex flex-col transition-all cursor-pointer group overflow-hidden",
            status === "REJECTED" || status === "rejected"
              ? "border-red-500/30 hover:border-red-500/50"
              : "hover:border-primary/50"
          )}
          onClick={() => navigate(`/dashboard/tournaments/${t.id}`)}
        >
          {/* ... (Header and Content remain same) ... */}
          <CardHeader className="flex flex-row gap-4 items-start space-y-0 pb-2">
            {/* LOGO */}
            <div className="h-12 w-12 shrink-0 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
              {t.logo_url ? (
                <img
                  src={t.logo_url}
                  alt={t.tournament_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Trophy className="h-6 w-6 text-zinc-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <Badge
                  className={
                    t.status.toLowerCase() === "open"
                      ? "bg-emerald-500"
                      : t.status.toLowerCase() === "ongoing"
                      ? "bg-primary animate-pulse"
                      : "bg-zinc-700"
                  }
                >
                  {t.status}
                </Badge>
                <span className="text-xs font-mono text-zinc-500 whitespace-nowrap ml-2">
                  {t.start_date
                    ? new Date(t.start_date).toLocaleDateString()
                    : "TBD"}
                </span>
              </div>
              <CardTitle className="text-white group-hover:text-primary transition-colors truncate">
                {t.tournament_name}
              </CardTitle>
              <CardDescription className="truncate">
                Format: {t.format ? t.format.replace("_", " ") : "Standard"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-2">
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" /> Premiação em Breve
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            {isRegistered ? (
              status === "PENDING" || status === "pending" ? (
                <div className="w-full space-y-2">
                  <Button
                    disabled
                    className="w-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  >
                     Aguardando Aprovação
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={(e) => { e.stopPropagation(); setShowWithdrawDialog(true); }}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancelar Inscrição"}
                  </Button>
                </div>
              ) : status === "REJECTED" || status === "rejected" ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReason(true);
                  }}
                >
                  <AlertCircle className="mr-2 h-4 w-4" /> Inscrição Rejeitada
                </Button>
              ) : (
                <Button className="w-full bg-zinc-800 text-white hover:bg-zinc-700">
                  Ver Painel <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )
            ) : t.allow_signups ? (
              <Button
                onClick={(e) => handleRegisterClick(t, e)}
                className="w-full bg-primary text-primary-foreground font-bold"
              >
                Registrar Time
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full border-white/10 text-zinc-500"
              >
                Ver Detalhes
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* REJECTION REASON DIALOG */}
        <Dialog open={showReason} onOpenChange={setShowReason}>
          <DialogContent className="bg-zinc-950 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" /> Inscrição Rejeitada
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Sua inscrição para <strong>{t.tournament_name}</strong> foi
                rejeitada pelos administradores.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 my-4">
              <h4 className="text-sm font-bold text-red-400 mb-1">Motivo:</h4>
              <p className="text-sm text-red-200">
                {rejectionReason || "Nenhum motivo específico fornecido."}
              </p>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowReason(false)}>
                Fechar
              </Button>
              <Button 
                onClick={() => setShowDismissDialog(true)}
                disabled={isWithdrawing}
                variant="destructive"
              >
                Dispensar & Tentar Novamente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Dialogs */}
        <ConfirmDialog
          open={showWithdrawDialog}
          onOpenChange={setShowWithdrawDialog}
          title="Cancelar Inscrição"
          description="Tem certeza de que deseja cancelar sua inscrição no torneio? Você pode se inscrever novamente mais tarde se as inscrições ainda estiverem abertas."
          confirmText={isWithdrawing ? "Cancelando..." : "Cancelar Inscrição"}
          cancelText="Voltar"
          variant="warning"
          onConfirm={handleWithdraw}
          loading={isWithdrawing}
        />

        <ConfirmDialog
          open={showDismissDialog}
          onOpenChange={setShowDismissDialog}
          title="Dispensar Rejeição"
          description="Tem certeza de que deseja dispensar esta rejeição? Você poderá se inscrever novamente se as inscrições ainda estiverem abertas."
          confirmText={isWithdrawing ? "Dispensando..." : "Dispensar & Tentar Novamente"}
          cancelText="Voltar"
          variant="destructive"
          onConfirm={handleDismissRejection}
          loading={isWithdrawing}
        />
      </>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Central de Torneios</h1>
          <p className="text-zinc-400">
            Encontre e registre-se em próximos torneios.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-white/10"
            onClick={refreshData}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Atualizar Dados"
            )}
          </Button>
          {!myTeam && (
            <Button asChild variant="outline" className="border-white/10">
              <Link to="/dashboard/team">
                <Users className="mr-2 h-4 w-4" /> Criar Time para Jogar
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {/* --- Featured / Active --- */}
        {activeTournament && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" /> Seu Torneio Ativo
            </h2>
            <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-zinc-900 group">
              {/* Banner Background */}
              {activeTournament.banner_url && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={activeTournament.banner_url}
                    alt="Banner"
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
                </div>
              )}

              <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Large Logo */}
                <div className="h-32 w-32 shrink-0 rounded-xl bg-zinc-800 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-2xl">
                   {activeTournament.logo_url ? (
                    <img
                      src={activeTournament.logo_url}
                      alt={activeTournament.tournament_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Trophy className="h-12 w-12 text-zinc-500" />
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <Badge className="mb-2 bg-primary text-primary-foreground">
                      {activeTournament.status}
                    </Badge>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tight">
                      {activeTournament.tournament_name}
                    </h3>
                  </div>
                  
                  <p className="text-zinc-300 max-w-2xl leading-relaxed">
                    {activeTournament.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      size="lg"
                      onClick={() =>
                        navigate(`/dashboard/tournaments/${activeTournament.id}`)
                      }
                      className="font-bold bg-primary hover:bg-primary/90"
                    >
                      Ir para Central de Comando <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Main List (Tabs) --- */}
        <Tabs defaultValue="open" className="w-full">
          <TabsList className="bg-zinc-900 border border-white/10">
            <TabsTrigger value="open">Futuros</TabsTrigger>
            <TabsTrigger value="ongoing">Em Andamento</TabsTrigger>
            <TabsTrigger value="past">Passados</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openTournaments.length > 0 ? (
                openTournaments.map((t) => (
                  <TournamentCard key={t.id} t={t} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-lg">
                  Nenhum torneio aberto para inscrição.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ongoing" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingTournaments.length > 0 ? (
                ongoingTournaments.map((t) => (
                  <TournamentCard key={t.id} t={t} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-lg">
                  Nenhum torneio em andamento.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTournaments.length > 0 ? (
                pastTournaments.map((t) => (
                  <TournamentCard key={t.id} t={t} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-lg">
                  Nenhum torneio passado encontrado.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmar Inscrição</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Registrando <strong>{myTeam?.name}</strong> para{" "}
              <strong>{selectedTournament?.tournament_name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* 1. Requirements Check */}
            <div className="flex items-start gap-3 p-3 rounded bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>
                Garanta que seu time tenha pelo menos <strong>5 membros</strong>. O
                sistema rejeitará times incompletos.
              </p>
            </div>

            {/* 2. Payment Proof Upload */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Comprovante de Pagamento (Obrigatório)</Label>
              <div className="flex items-center gap-4">
                {!proofPath ? (
                  <div className="relative flex items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/5 cursor-pointer transition-colors bg-black/20">
                    <div className="flex flex-col items-center gap-1 text-zinc-500">
                      {isUploadingProof ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Upload className="h-6 w-6" />
                      )}
                      <span className="text-xs uppercase font-bold">
                        Enviar Recibo (Imagem/PDF)
                      </span>
                    </div>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleProofUpload}
                      accept="image/*,application/pdf"
                      disabled={isUploadingProof}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm font-bold">
                        Comprovante Enviado com Sucesso
                      </span>
                    </div>
                    <button
                      onClick={() => setProofPath("")}
                      className="text-emerald-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-zinc-500">
                Por favor, faça upload de um print da transferência (Pix/Banco) para{" "}
                <strong>payments@cselol.com</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500 justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>
                Capitão Verificado: {myTeam?.created_by_user_id ? "Sim" : "Não"}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRegisterOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={processRegistration}
              disabled={isRegistering || !proofPath || isUploadingProof}
              className="bg-primary text-primary-foreground font-bold"
            >
              {isRegistering ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Confirmar & Registrar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
