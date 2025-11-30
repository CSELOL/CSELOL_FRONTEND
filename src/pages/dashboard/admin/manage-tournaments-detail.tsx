import { useState, useEffect, useRef } from "react";
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
  Eye,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
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

// API Services
import {
  getTournamentByIdAPI,
  updateTournamentAPI,
  getTournamentTeamsAPI,
  updateRegistrationStatusAPI,
  getPaymentProofAPI,
} from "@/api/tournaments";

// Storage Service
import { uploadTournamentAsset, deleteAsset } from "@/services/storage-service";

// Components
import { MatchEditorDialog } from "@/components/dashboard/admin/match-editor-dialog";

// Helpers
const formatDateForInput = (isoString: string | null) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const formatDateDisplay = (isoString: string | null) => {
  if (!isoString) return "TBD";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("pt-BR", {
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

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Data States
  const [tournament, setTournament] = useState<any>(null);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);

  // Form State for Editing
  const [formData, setFormData] = useState<any>({
    tournament_name: "",
    tournament_description: "",
    status: "",
    start_date: "",
    banner_url: "",
    logo_url: "",
    format: "",
    is_listed: false,
    allow_signups: false,
    has_lower_bracket: false,
  });

  // Match Editor State
  const [isMatchEditorOpen, setIsMatchEditorOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    actionVariant?: "default" | "destructive";
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionLabel: "Confirm",
    onConfirm: async () => {},
  });

  // --- 1. Load Data ---
  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getTournamentByIdAPI(id);
      setTournament(data);

      setFormData({
        tournament_name: data.tournament_name || "",
        tournament_description: data.tournament_description || "",
        status: data.status || "scheduled",
        start_date: data.start_date || "",
        banner_url: data.banner_url || "",
        logo_url: data.logo_url || "",
        format: data.format || "single_elimination",
        is_listed: data.is_listed ?? false,
        allow_signups: data.allow_signups ?? false,
        has_lower_bracket: data.has_lower_bracket ?? false,
      });

      const teamsData = await getTournamentTeamsAPI(id);
      setRegisteredTeams(teamsData);
    } catch (error) {
      console.error("Failed to fetch tournament:", error);
      toast.error("Failed to fetch tournament data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // --- 2. Handle Uploads (UI State Update Only) ---
  const handleAssetUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We allow replacing without saving first.
    // Ideally, we would delete the old file if it exists, but since we aren't saving to DB yet,
    // we just overwrite the UI state. The old file becomes an orphan (acceptable for MVP).

    setIsUploading(true);
    try {
      const url = await uploadTournamentAsset(file, type);

      // Update Form Data Only
      setFormData((prev: any) => ({
        ...prev,
        [type === "banner" ? "banner_url" : "logo_url"]: url,
      }));

      toast.info("Image uploaded! Click 'Save Changes' to persist.");
    } catch (e) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setIsUploading(false);
    }
  };

  // --- 3. Handle Asset Deletion (UI State Update Only + File Delete) ---
  const confirmDeleteAsset = (type: "banner" | "logo") => {
    setAlertConfig({
      isOpen: true,
      title: `Remove ${type === "banner" ? "Banner" : "Logo"}?`,
      description: "This will remove the image file from storage immediately.",
      actionLabel: "Delete",
      actionVariant: "destructive",
      onConfirm: async () => {
        const url = type === "banner" ? formData.banner_url : formData.logo_url;
        if (url) {
          try {
            await deleteAsset(url); // Delete actual file

            // Clear Form State
            setFormData((prev: any) => ({
              ...prev,
              [type === "banner" ? "banner_url" : "logo_url"]: "",
            }));

            toast.success(
              "Image removed. Click 'Save Changes' to update tournament."
            );
          } catch (e) {
            toast.error("Failed to delete file.");
          }
        }
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // --- 4. Save Settings (Commits everything to DB) ---
  const handleSaveSettings = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        start_date: formData.start_date
          ? new Date(formData.start_date).toISOString()
          : null,
      };

      const updated = await updateTournamentAPI(id, payload);
      setTournament(updated); // Update local tournament state
      toast.success("Tournament settings saved successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 5. Team Actions ---
  const promptStatusChange = (
    regId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    setAlertConfig({
      isOpen: true,
      title: `${status === "APPROVED" ? "Approve" : "Reject"} Team?`,
      description: `Are you sure you want to ${status.toLowerCase()} this team registration?`,
      actionLabel: status === "APPROVED" ? "Approve" : "Reject",
      actionVariant: status === "APPROVED" ? "default" : "destructive",
      onConfirm: async () => {
        try {
          await updateRegistrationStatusAPI(regId, status);
          loadData();
          toast.success(`Team ${status.toLowerCase()}.`);
        } catch (error) {
          toast.error("Failed to update status");
        }
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleViewProof = async (regId: number) => {
    try {
      const { url } = await getPaymentProofAPI(regId);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Proof not found.");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  if (!tournament)
    return <div className="text-white p-10">Tournament not found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
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
                {tournament.tournament_name}
              </h1>
              <Badge
                className={
                  tournament.status === "running"
                    ? "bg-red-500 animate-pulse"
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

        {/* OVERVIEW */}
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
                  {registeredTeams.length} / 32
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
                  {tournament.format?.replace("_", " ")}
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

        {/* TEAMS */}
        <TabsContent value="teams" className="mt-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Registered Teams</CardTitle>
            </CardHeader>
            <CardContent>
              {registeredTeams.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  No teams have registered yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Team Name</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredTeams.map((team: any) => (
                      <TableRow
                        key={team.id}
                        className="border-white/5 hover:bg-white/5"
                      >
                        <TableCell className="font-bold text-white">
                          {team.name}
                        </TableCell>
                        <TableCell className="text-zinc-400">
                          {team.tag}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              team.registration_status === "PENDING"
                                ? "text-yellow-500"
                                : team.registration_status === "APPROVED"
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {team.registration_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() =>
                              handleViewProof(team.registration_id)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          {team.registration_status === "PENDING" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() =>
                                  promptStatusChange(
                                    team.registration_id,
                                    "APPROVED"
                                  )
                                }
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/10 hover:bg-red-500/10 text-red-500"
                                onClick={() =>
                                  promptStatusChange(
                                    team.registration_id,
                                    "REJECTED"
                                  )
                                }
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MATCHES */}
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

        {/* SETTINGS */}
        <TabsContent value="settings" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">General Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Tournament Name</Label>
                  <Input
                    className="bg-black/20 border-white/10 text-white"
                    value={formData.tournament_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tournament_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Description</Label>
                  <Textarea
                    className="bg-black/20 border-white/10 min-h-[100px]"
                    value={formData.tournament_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tournament_description: e.target.value,
                      })
                    }
                  />
                </div>

                {/* BANNER UPLOAD - UPDATED UI */}
                <div className="space-y-2">
                  <Label className="text-zinc-400">Tournament Banner</Label>
                  <div className="relative h-36 w-full rounded-xl border border-white/10 bg-black overflow-hidden group">
                    {formData.banner_url ? (
                      <>
                        <img
                          src={formData.banner_url}
                          className="w-full h-full object-cover opacity-80 transition-all"
                        />

                        {/* Trash Button - Top Right */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-200 border border-red-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteAsset("banner");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {/* Change Overlay - Centered */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px] z-10">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              bannerInputRef.current?.click();
                            }}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            Change Image
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center h-full text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                        onClick={() => bannerInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          Upload Banner
                        </span>
                      </div>
                    )}
                    <input
                      ref={bannerInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleAssetUpload(e, "banner")}
                      disabled={isUploading}
                    />
                  </div>
                </div>

                {/* LOGO UPLOAD - UPDATED UI */}
                <div className="space-y-2">
                  <Label className="text-zinc-400">Tournament Logo</Label>
                  <div className="relative h-24 w-24 rounded-xl border border-white/10 bg-black overflow-hidden group">
                    {formData.logo_url ? (
                      <>
                        <img
                          src={formData.logo_url}
                          className="w-full h-full object-cover opacity-80 transition-all"
                        />

                        {/* Trash Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-md bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-200 border border-red-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteAsset("logo");
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>

                        {/* Change Overlay */}
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px] cursor-pointer z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            logoInputRef.current?.click();
                          }}
                        >
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded bg-black/30 backdrop-blur-md">
                            Change
                          </span>
                        </div>
                      </>
                    ) : (
                      <div
                        className="flex items-center justify-center h-full text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <ImageIcon className="h-6 w-6 opacity-50" />
                      </div>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleAssetUpload(e, "logo")}
                      disabled={isUploading}
                    />
                  </div>
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

                <div className="grid gap-2">
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

      <MatchEditorDialog
        open={isMatchEditorOpen}
        onOpenChange={setIsMatchEditorOpen}
        matchToEdit={selectedMatch}
        availableTeams={[]}
      />

      {/* ALERT DIALOG */}
      <AlertDialog
        open={alertConfig.isOpen}
        onOpenChange={(isOpen) =>
          setAlertConfig((prev) => ({ ...prev, isOpen }))
        }
      >
        <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={alertConfig.onConfirm}
              className={
                alertConfig.actionVariant === "destructive"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-primary text-primary-foreground"
              }
            >
              {alertConfig.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
