import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trophy,
  MoreHorizontal,
  Search,
  ArrowRight,
  History,
  Archive,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CreateTournamentDialog } from "@/components/dashboard/admin/create-tournament-dialog";
import {
  getTournamentsAPI,
  updateTournamentAPI,
  deleteTournamentAPI,
} from "@/api/tournaments";

// 1. Updated Interface matching your DB Schema exactly
interface Tournament {
  id: number;
  tournament_name: string; // Changed from name
  tournament_description: string; // Changed from description
  status: string;
  start_date: string | null;
  banner_url: string | null;
  logo_url: string | null;
  format: string;
  max_teams: number; // API doesn't return this based on schema, but keeping if you add it back or derive it
  is_listed: boolean;
  allow_signups: boolean;
  is_archived: boolean;
}

export function AdminTournamentsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Alert Dialog State
  const [alertOpen, setAlertOpen] = useState(false);
  const [actionType, setActionType] = useState<"archive" | "delete" | null>(
    null
  );
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  async function loadTournaments() {
    setIsLoading(true);
    try {
      const data = await getTournamentsAPI();
      // Sort by ID descending
      const sorted = data.sort((a: Tournament, b: Tournament) => b.id - a.id);
      setTournaments(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTournaments();
  }, []);

  // --- HANDLERS FOR OPENING DIALOGS ---
  const promptArchive = (t: Tournament) => {
    setSelectedTournament(t);
    setActionType("archive");
    setAlertOpen(true);
  };

  const promptDelete = (t: Tournament) => {
    setSelectedTournament(t);
    setActionType("delete");
    setAlertOpen(true);
  };

  // --- EXECUTE ACTION ---
  const confirmAction = async () => {
    if (!selectedTournament || !actionType) return;

    setIsActionLoading(true);
    try {
      if (actionType === "archive") {
        // Toggle the current archive status
        await updateTournamentAPI(selectedTournament.id, {
          is_archived: !selectedTournament.is_archived,
        });
      } else if (actionType === "delete") {
        await deleteTournamentAPI(selectedTournament.id);
      }

      // Refresh list
      await loadTournaments();
      setAlertOpen(false);
    } catch (error) {
      console.error("Action failed", error);
      alert("Failed to perform action");
    } finally {
      setIsActionLoading(false);
      setSelectedTournament(null);
      setActionType(null);
    }
  };

  // --- FILTERS ---
  const activeTournaments = tournaments.filter((t) => !t.is_archived);
  const archivedTournaments = tournaments.filter((t) => t.is_archived);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Tournament Management
          </h1>
          <p className="text-zinc-400">Organize seasons and community cups.</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Tournament
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-zinc-900/50 border border-white/10 h-10">
            <TabsTrigger value="active" className="gap-2">
              <Trophy className="h-4 w-4" /> Active Events
            </TabsTrigger>
            <TabsTrigger value="archive" className="gap-2">
              <Archive className="h-4 w-4" /> Archive
            </TabsTrigger>
          </TabsList>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-lg border border-white/5 w-64">
            <Search className="h-4 w-4 text-zinc-500 ml-2" />
            <Input
              placeholder="Search..."
              className="border-0 bg-transparent focus-visible:ring-0 text-white h-7 text-sm"
            />
          </div>
        </div>

        {/* --- ACTIVE TAB --- */}
        <TabsContent value="active" className="space-y-6">
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <>
              {activeTournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  t={t}
                  onArchive={() => promptArchive(t)}
                  onDelete={() => promptDelete(t)}
                />
              ))}
              {activeTournaments.length === 0 && (
                <div className="text-center text-zinc-500 py-10 border border-dashed border-white/10 rounded-lg">
                  No active tournaments found.
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* --- ARCHIVE TAB --- */}
        <TabsContent value="archive" className="space-y-6">
          {archivedTournaments.map((t) => (
            <TournamentCard
              key={t.id}
              t={t}
              onArchive={() => promptArchive(t)} // This will unarchive it
              onDelete={() => promptDelete(t)}
            />
          ))}
          {archivedTournaments.length === 0 && (
            <div className="text-center text-zinc-500 py-10 border border-dashed border-white/10 rounded-lg">
              No archived tournaments found.
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateTournamentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={loadTournaments}
      />

      {/* --- CONFIRMATION DIALOG (Pretty) --- */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {actionType === "delete" && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              {actionType === "archive" && (
                <Archive className="h-5 w-5 text-yellow-500" />
              )}
              Confirm Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {actionType === "delete"
                ? `Are you sure you want to permanently delete "${selectedTournament?.tournament_name}"? This action cannot be undone.`
                : `Are you sure you want to ${
                    selectedTournament?.is_archived ? "restore" : "archive"
                  } "${selectedTournament?.tournament_name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmAction();
              }}
              className={
                actionType === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-yellow-600 hover:bg-yellow-700 text-black"
              }
              disabled={isActionLoading}
            >
              {isActionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {actionType === "delete"
                ? "Delete Forever"
                : selectedTournament?.is_archived
                ? "Restore"
                : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Sub-component for Cleaner Code
function TournamentCard({
  t,
  onArchive,
  onDelete,
}: {
  t: Tournament;
  onArchive: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
      <Card className="relative bg-zinc-950 border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-full md:w-2/3 h-full bg-gradient-to-l from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none z-10" />
        <div
          className="absolute top-0 right-0 w-full md:w-2/3 h-full bg-cover bg-center opacity-40 z-0"
          style={{
            backgroundImage: t.banner_url ? `url(${t.banner_url})` : undefined,
            backgroundColor: "#000",
          }}
        />

        <div className="relative z-20 grid md:grid-cols-3 gap-6 p-6 md:p-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                {t.status}
              </Badge>
              {t.is_archived && <Badge variant="secondary">ARCHIVED</Badge>}
            </div>
            {/* UPDATED: Uses tournament_name */}
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight leading-none">
              {t.tournament_name}
            </h2>
            {/* UPDATED: Uses tournament_description */}
            <p className="text-zinc-400 max-w-lg line-clamp-2">
              {t.tournament_description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-col justify-center items-end gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
            <Button
              className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-zinc-200"
              asChild
            >
              <Link to={`/dashboard/admin/tournaments/${t.id}`}>
                Manage <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <div className="flex gap-2 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full border border-white/10 text-zinc-400 bg-black/40"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-zinc-950 border-white/10 text-white"
                >
                  <DropdownMenuItem onClick={onArchive}>
                    <Archive className="mr-2 h-4 w-4" />{" "}
                    {t.is_archived ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-400 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
