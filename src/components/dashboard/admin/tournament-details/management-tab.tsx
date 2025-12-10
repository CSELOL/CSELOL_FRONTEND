import { useState, useEffect } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Plus,
  Trophy,
  Settings2,
  Loader2,
  RefreshCw,
  Calendar,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// APIs
import {
  getTournamentMatchesAPI,
  generateBracketAPI,
  generateGroupMatchesAPI,
} from "@/api/matches";
import {
  getTournamentTeamsAPI,
  getTournamentGroupsAPI,
} from "@/api/tournaments";

// Components
import { GroupAssignmentView } from "./group-management/GroupAssignmentView";
import { MatchCreatorDialog } from "./match-management/MatchCreatorDialog";
import { AdminMatchList } from "./admin-match-list";
import { MatchEditorDialog } from "../match-editor-dialog";
import { GroupMatchBoard } from "./match-management/GroupMatchBoard"; // The new board component

// Types
import type { Team } from "@/api/teams";

interface ManagementTabProps {
  tournamentId: string;
}

// Internal interface for state management
interface GroupData {
  groups: { id: string; name: string; teams: Team[] }[];
  unassigned: Team[];
}

export function TournamentManagementTab({ tournamentId }: ManagementTabProps) {
  const [activeView, setActiveView] = useState<
    "groups" | "matches" | "playoffs"
  >("groups");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Data State
  const [groupData, setGroupData] = useState<GroupData>({
    groups: [],
    unassigned: [],
  });
  const [matches, setMatches] = useState<any[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  // Dialog State
  const [isMatchCreatorOpen, setIsMatchCreatorOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [isMatchEditorOpen, setIsMatchEditorOpen] = useState(false);
  const [showScheduleConfirm, setShowScheduleConfirm] = useState(false);
  const [showBracketConfirm, setShowBracketConfirm] = useState(false);

  // Derived state for filtering matches
  const groupMatches = matches.filter((m: any) => m.stage === "groups");
  const playoffMatches = matches.filter((m: any) => m.stage === "playoffs");

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Basic Data
      const [teamsData, matchesData] = await Promise.all([
        getTournamentTeamsAPI(tournamentId),
        getTournamentMatchesAPI(tournamentId),
      ]);

      const registeredTeams = Array.isArray(teamsData) ? teamsData : [];
      setAllTeams(registeredTeams);
      setMatches(Array.isArray(matchesData) ? matchesData : []);

      // 2. Fetch Groups
      try {
        const groupsRes = await getTournamentGroupsAPI(tournamentId);
        const formattedGroups = groupsRes.groups.map((g: any) => ({
          id: `group-${g.name}`,
          name: `Group ${g.name}`,
          teams: g.teams,
        }));

        setGroupData({
          groups: formattedGroups,
          unassigned: groupsRes.unassigned || [],
        });
      } catch (err) {
        setGroupData({ groups: [], unassigned: registeredTeams });
      }
    } catch (error) {
      console.error(error);
      toast.error("Falha ao carregar dados do torneio");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  // --- ACTIONS ---

  const handleGenerateGroupSchedule = async () => {
    // 1. Validation: Are there groups?
    if (groupData.groups.length === 0) {
      toast.error(
        "Nenhum grupo encontrado. Por favor atribua times e clique em 'Salvar Atribuições' primeiro."
      );
      return;
    }

    // 2. Validation: Does every group have at least 2 teams?
    const invalidGroups = groupData.groups.filter((g) => g.teams.length < 2);
    if (invalidGroups.length > 0) {
      toast.error(
        `Não é possível gerar: ${invalidGroups
          .map((g) => g.name)
          .join(", ")} têm menos de 2 times.`
      );
      return;
    }

    if (
      groupData.groups.length === 0 ||
      groupData.groups.some((g) => g.teams.length < 2)
    ) {
      // Already validated above, just for safety
      return;
    }

    setIsGenerating(true);
    try {
      await generateGroupMatchesAPI(tournamentId, { groups: groupData.groups });
      toast.success("Calendário Gerado com Sucesso!");

      // Reload to get the new matches
      await loadData();
      setActiveView("matches");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao gerar calendário");
    } finally {
      setIsGenerating(false);
      setShowScheduleConfirm(false);
    }
  };

  const handleGenerateBracket = async () => {
    setIsGenerating(true);
    try {
      await generateBracketAPI(tournamentId);
      toast.success("Chave Gerada!");
      await loadData();
      setActiveView("matches");
    } catch (e) {
      toast.error("Falha ao gerar chave");
    } finally {
      setIsGenerating(false);
      setShowBracketConfirm(false);
    }
  };

  const openEditor = (match: any) => {
    setSelectedMatch(match);
    setIsMatchEditorOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- TAB NAVIGATION --- */}
      <div className="flex items-center justify-between">
        <Tabs
          value={activeView}
          onValueChange={(v: any) => setActiveView(v)}
          className="w-full max-w-lg"
        >
          <TabsList className="bg-zinc-900 border border-white/10 w-full grid grid-cols-3">
            <TabsTrigger value="groups">Grupos</TabsTrigger>
            <TabsTrigger value="playoffs">Playoffs</TabsTrigger>
            <TabsTrigger
              value="matches"
              className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold"
            >
              Partidas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={loadData}
            title="Atualizar Dados"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMatchCreatorOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Partida Personalizada
          </Button>
        </div>
      </div>

      {/* --- TAB: GROUPS (Setup) --- */}
      {activeView === "groups" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500/20 rounded flex items-center justify-center shrink-0">
                <Save className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-blue-100 font-bold">
                  Passo 1: Atribuir & Salvar
                </h3>
                <p className="text-xs text-blue-200/60">
                  Arraste os times abaixo. Clique em{" "}
                  <strong className="text-white">Salvar Atribuições</strong>{" "}
                  dentro da caixa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (groupData.groups.length === 0) {
                    toast.error("Nenhum grupo encontrado. Por favor atribua times e clique em 'Salvar Atribuições' primeiro.");
                    return;
                  }
                  const invalidGroups = groupData.groups.filter((g) => g.teams.length < 2);
                  if (invalidGroups.length > 0) {
                    toast.error(`Não é possível gerar: ${invalidGroups.map((g) => g.name).join(", ")} têm menos de 2 times.`);
                    return;
                  }
                  setShowScheduleConfirm(true);
                }}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold whitespace-nowrap"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Calendar className="mr-2 h-4 w-4" />
                )}
                Passo 2: Gerar Calendário
              </Button>
            </div>
          </div>

          <GroupAssignmentView
            tournamentId={tournamentId}
            initialData={groupData}
            onSave={loadData}
            onCancel={() => {}}
          />
        </div>
      )}

      {/* --- TAB: PLAYOFFS (Setup) --- */}
      {activeView === "playoffs" && (
        <div className="space-y-6">
          <Card className="bg-zinc-900/20 border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
              <Trophy className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Gerar Chave de Playoffs
            </h3>
            <p className="text-zinc-400 text-sm mb-8 max-w-md">
              Gera uma chave de eliminação única.
            </p>
            <Button
              onClick={() => setShowBracketConfirm(true)}
              size="lg"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Settings2 className="mr-2 h-4 w-4" />
              )}
              Gerar Chave
            </Button>
          </Card>
        </div>
      )}

      {/* --- TAB: MATCHES (Execution) --- */}
      {activeView === "matches" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">Controle de Partidas</h3>
              <p className="text-sm text-zinc-500">
                Selecione uma fase para gerenciar partidas.
              </p>
            </div>
            {matches.length === 0 && (
              <div className="flex items-center gap-2 text-yellow-500 text-sm bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20">
                <AlertTriangle className="h-4 w-4" /> Nenhuma partida encontrada
              </div>
            )}
          </div>

          <Tabs defaultValue="groups" className="w-full">
            <TabsList className="bg-zinc-900 border border-white/10 w-full justify-start h-10 p-0 mb-4">
              <TabsTrigger
                value="groups"
                className="px-6 h-full data-[state=active]:bg-zinc-800"
              >
                Fase de Grupos ({groupMatches.length})
              </TabsTrigger>
              <TabsTrigger
                value="playoffs"
                className="px-6 h-full data-[state=active]:bg-zinc-800"
              >
                Playoffs ({playoffMatches.length})
              </TabsTrigger>
            </TabsList>

            {/* GROUPS BOARD VIEW */}
            <TabsContent
              value="groups"
              className="mt-0 animate-in fade-in slide-in-from-bottom-2"
            >
              <GroupMatchBoard
                matches={groupMatches}
                onMatchClick={openEditor}
              />
            </TabsContent>

            {/* PLAYOFFS LIST VIEW */}
            <TabsContent
              value="playoffs"
              className="mt-0 animate-in fade-in slide-in-from-bottom-2"
            >
              <AdminMatchList
                matches={playoffMatches}
                onEditMatch={openEditor}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* --- DIALOGS --- */}
      <MatchCreatorDialog
        open={isMatchCreatorOpen}
        onOpenChange={setIsMatchCreatorOpen}
        tournamentId={tournamentId}
        availableTeams={allTeams}
        onSuccess={loadData}
      />

      <MatchEditorDialog
        open={isMatchEditorOpen}
        onOpenChange={setIsMatchEditorOpen}
        matchToEdit={selectedMatch}
        availableTeams={allTeams}
        onSuccess={loadData}
      />

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={showScheduleConfirm}
        onOpenChange={setShowScheduleConfirm}
        title="Gerar Calendário de Grupos"
        description="Isso apagará as partidas de grupo existentes e gerará um novo calendário Round Robin. Tem certeza que deseja continuar?"
        confirmText={isGenerating ? "Gerando..." : "Gerar Calendário"}
        cancelText="Cancelar"
        variant="warning"
        onConfirm={handleGenerateGroupSchedule}
        loading={isGenerating}
      />

      <ConfirmDialog
        open={showBracketConfirm}
        onOpenChange={setShowBracketConfirm}
        title="Gerar Chave de Playoffs"
        description="Isso sobrescreverá a chave de playoffs existente. Tem certeza que deseja continuar?"
        confirmText={isGenerating ? "Gerando..." : "Gerar Chave"}
        cancelText="Cancelar"
        variant="warning"
        onConfirm={handleGenerateBracket}
        loading={isGenerating}
      />
    </div>
  );
}
