import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Settings,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Upload,
  Globe,
  Wifi,
  Shield,
  Trophy,
  Save,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// API Services
import { getTournamentByIdAPI, updateTournamentAPI } from "@/api/tournaments";

// Components
import { MatchEditorDialog } from "@/components/dashboard/admin/match-editor-dialog";
import { Label } from "@radix-ui/react-select";

// Helper: Convert ISO date to "YYYY-MM-DDThh:mm" for input fields
const formatDateForInput = (isoString: string | null) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Adjust for timezone offset if necessary, or use UTC
  return date.toISOString().slice(0, 16);
};

// Helper: Format for display
const formatDateDisplay = (isoString: string | null) => {
  if (!isoString) return "TBD";
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export function AdminTournamentDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Real Data State
  const [tournament, setTournament] = useState<any>(null);

  // Editable Form State
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    status: "",
    start_date: "",
    end_date: "",
    banner_url: "",
    max_teams: 16,
    format: "",
    is_listed: false,
    allow_signups: false,
  });

  // Match Editor State
  const [isMatchEditorOpen, setIsMatchEditorOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // --- 1. FETCH DATA ON MOUNT ---
  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getTournamentByIdAPI(id);
      setTournament(data);

      // Populate Form Data
      setFormData({
        name: data.name || "",
        description: data.description || "",
        status: data.status || "scheduled",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        banner_url: data.banner_url || "",
        max_teams: data.max_teams || 16,
        format: data.format || "single_elimination",
        is_listed: data.is_listed ?? true,
        allow_signups: data.allow_signups ?? true,
      });
    } catch (error) {
      console.error("Failed to fetch tournament:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // --- 2. HANDLE SAVE SETTINGS ---
  const handleSaveSettings = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const updated = await updateTournamentAPI(id, formData);
      setTournament(updated); // Update UI with response
      alert("Tournament settings updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update tournament.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  // Error State
  if (!tournament) {
    return <div className="text-white p-10">Tournament not found.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* --- Top Bar --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard/admin/tournaments">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">
                {tournament.name}
              </h1>
              <Badge
                className={
                  tournament.status === "running"
                    ? "bg-red-500 animate-pulse"
                    : tournament.status === "scheduled"
                    ? "bg-emerald-500"
                    : "bg-zinc-500"
                }
              >
                {tournament.status}
              </Badge>
            </div>
            <p className="text-zinc-400 text-sm flex items-center gap-2 mt-1">
              ID: #{id} • <Calendar className="h-3 w-3" />{" "}
              {formatDateDisplay(tournament.start_date)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            className="border-white/10 text-zinc-400 hover:text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button variant="destructive" className="font-bold">
            <AlertTriangle className="mr-2 h-4 w-4" /> Danger Zone
          </Button>
        </div>
      </div>

      {/* --- Navigation Tabs --- */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-900 border border-white/5 w-full justify-start h-12">
          <TabsTrigger value="overview" className="h-10 px-6">
            Overview
          </TabsTrigger>
          <TabsTrigger value="teams" className="h-10 px-6">
            Teams
          </TabsTrigger>
          <TabsTrigger value="matches" className="h-10 px-6">
            Matches
          </TabsTrigger>
          <TabsTrigger value="settings" className="h-10 px-6">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Total Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  0 / {tournament.max_teams}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white uppercase">
                  {tournament.format.replace("_", " ")}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Banner Preview */}
          <div className="h-48 w-full rounded-xl border border-white/10 bg-black relative overflow-hidden group">
            {tournament.banner_url ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${tournament.banner_url})` }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                No Banner Uploaded
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: TEAMS (Placeholder for now) */}
        <TabsContent value="teams" className="mt-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Registered Teams</CardTitle>
              <CardDescription>
                Teams linked to this tournament ID.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-zinc-500">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>Team fetching logic will be implemented next.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: MATCHES */}
        <TabsContent value="matches" className="mt-6">
          <div className="flex justify-between items-center mb-6 bg-zinc-900/50 p-4 rounded-lg border border-white/10">
            <div>
              <h3 className="text-white font-bold">Match Schedule</h3>
              <p className="text-sm text-zinc-400">
                Create matches manually or generate bracket.
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedMatch(null);
                setIsMatchEditorOpen(true);
              }}
              className="bg-primary font-bold text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Match
            </Button>
          </div>
          <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-lg">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No matches found for this event.</p>
          </div>
        </TabsContent>

        {/* TAB 4: SETTINGS (Connected to API) */}
        <TabsContent value="settings" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* General Settings */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">General Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Tournament Name</Label>
                  <Input
                    className="bg-black/20 border-white/10 text-white"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Description</Label>
                  <Textarea
                    className="bg-black/20 border-white/10 min-h-[100px]"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Banner URL</Label>
                  <Input
                    className="bg-black/20 border-white/10 text-white"
                    value={formData.banner_url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, banner_url: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData({ ...formData, status: v })
                    }
                  >
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="open">Open (Signups)</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Start Date</Label>
                    <Input
                      type="datetime-local"
                      className="bg-black/20 border-white/10"
                      value={formatDateForInput(formData.start_date)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          start_date: new Date(e.target.value).toISOString(),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Max Teams</Label>
                    <Input
                      type="number"
                      className="bg-black/20 border-white/10"
                      value={formData.max_teams}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_teams: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-white/10 rounded bg-black/20">
                  <span className="text-sm text-zinc-300">Allow Signups?</span>
                  <Switch
                    checked={formData.allow_signups}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, allow_signups: v })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 border border-white/10 rounded bg-black/20">
                  <span className="text-sm text-zinc-300">
                    Publicly Listed?
                  </span>
                  <Switch
                    checked={formData.is_listed}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, is_listed: v })
                    }
                  />
                </div>

                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full bg-primary font-bold mt-4"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Match Editor Dialog (Mocked Teams for now) */}
      <MatchEditorDialog
        open={isMatchEditorOpen}
        onOpenChange={setIsMatchEditorOpen}
        matchToEdit={selectedMatch}
        availableTeams={[]}
      />
    </div>
  );
}
