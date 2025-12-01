import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon,
  Calendar,
  Globe,
  Lock,
  AlertTriangle,
} from "lucide-react";
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
import { uploadTournamentAsset, deleteAsset } from "@/services/storage-service";
import { updateTournamentAPI } from "@/api/tournaments";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
  tournament: any;
  onUpdate: () => void;
}

const formatDateForInput = (isoString: string | null) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export function TournamentSettingsForm({
  tournament,
  onUpdate,
}: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // State for Delete Confirmation Dialog
  const [deleteTarget, setDeleteTarget] = useState<"banner" | "logo" | null>(
    null
  );

  const [formData, setFormData] = useState({
    tournament_name: tournament.tournament_name || "",
    tournament_description: tournament.tournament_description || "",
    status: tournament.status || "scheduled",
    start_date: tournament.start_date || "",
    banner_url: tournament.banner_url || "",
    logo_url: tournament.logo_url || "",
    is_listed: tournament.is_listed ?? false,
    allow_signups: tournament.allow_signups ?? false,
  });

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        start_date: formData.start_date
          ? new Date(formData.start_date).toISOString()
          : null,
      };

      await updateTournamentAPI(tournament.id, payload);
      toast.success("Settings saved successfully!");
      onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadTournamentAsset(file, type);
      setFormData((prev) => ({
        ...prev,
        [type === "banner" ? "banner_url" : "logo_url"]: url,
      }));
      toast.success(
        `${
          type === "banner" ? "Banner" : "Logo"
        } uploaded! Click Save to persist.`
      );
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Triggered by the Delete button
  const triggerDelete = (type: "banner" | "logo") => {
    setDeleteTarget(type);
  };

  // Triggered by the Dialog 'Confirm' button
  const executeDelete = async () => {
    if (!deleteTarget) return;

    const url =
      deleteTarget === "banner" ? formData.banner_url : formData.logo_url;
    if (!url) {
      setDeleteTarget(null);
      return;
    }

    try {
      await deleteAsset(url);
      setFormData((prev) => ({
        ...prev,
        [deleteTarget === "banner" ? "banner_url" : "logo_url"]: "",
      }));
      toast.success(
        `${deleteTarget === "banner" ? "Banner" : "Logo"} removed.`
      );
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete image from storage");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-5">
        {/* LEFT COLUMN: VISUALS */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Visual Identity
              </CardTitle>
              <CardDescription>
                Branding for your tournament page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* LOGO UPLOAD */}
              <div className="space-y-3">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">
                  Tournament Logo
                </Label>
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "relative h-24 w-24 shrink-0 rounded-xl border-2 border-dashed border-white/10 bg-black/40 overflow-hidden group transition-all",
                      !formData.logo_url &&
                        "hover:border-white/30 hover:bg-white/5 cursor-pointer flex items-center justify-center"
                    )}
                    onClick={() =>
                      !formData.logo_url && logoInputRef.current?.click()
                    }
                  >
                    {formData.logo_url ? (
                      <>
                        <img
                          src={formData.logo_url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              logoInputRef.current?.click();
                            }}
                          >
                            <Upload className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-500 backdrop-blur-md border border-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerDelete("logo");
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Upload className="h-8 w-8 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    )}
                  </div>
                  <div className="text-sm text-zinc-500 pt-2">
                    <p>Recommended: 200x200px.</p>
                    <p>Formats: PNG, JPG.</p>
                  </div>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, "logo")}
                />
              </div>

              {/* BANNER UPLOAD */}
              <div className="space-y-3">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">
                  Tournament Banner
                </Label>
                <div
                  className={cn(
                    "relative h-40 w-full rounded-xl border-2 border-dashed border-white/10 bg-black/40 overflow-hidden group transition-all",
                    !formData.banner_url &&
                      "hover:border-white/30 hover:bg-white/5 cursor-pointer"
                  )}
                  onClick={() =>
                    !formData.banner_url && bannerInputRef.current?.click()
                  }
                >
                  {formData.banner_url ? (
                    <>
                      <img
                        src={formData.banner_url}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            bannerInputRef.current?.click();
                          }}
                        >
                          <Upload className="h-3 w-3 mr-2" /> Change
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 bg-red-500/20 hover:bg-red-500/40 text-red-500 backdrop-blur-md border border-red-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerDelete("banner");
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      <Upload className="h-10 w-10 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Click to Upload Banner
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, "banner")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-zinc-400">Tournament Name</Label>
                <Input
                  className="bg-black/20 border-white/10 text-white focus-visible:ring-primary"
                  value={formData.tournament_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tournament_name: e.target.value,
                    })
                  }
                  placeholder="e.g. Winter Championship 2024"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData({ ...formData, status: v })
                    }
                  >
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
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
                  <Label className="text-zinc-400 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Start Date
                  </Label>
                  <Input
                    type="datetime-local"
                    className="bg-black/20 border-white/10 text-white"
                    value={formatDateForInput(formData.start_date)}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-zinc-400">Description</Label>
                <Textarea
                  className="bg-black/20 border-white/10 min-h-[120px] text-white focus-visible:ring-primary"
                  value={formData.tournament_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tournament_description: e.target.value,
                    })
                  }
                  placeholder="Describe rules, prize pool, and schedule..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Access & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-white/[0.02]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-base text-white">
                      Allow Signups
                    </Label>
                    {formData.allow_signups && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Players can see the "Register" button on the tournament
                    page.
                  </p>
                </div>
                <Switch
                  checked={formData.allow_signups}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, allow_signups: v })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-white/[0.02]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-base text-white flex items-center gap-2">
                      {formData.is_listed ? (
                        <Globe className="h-3 w-3 text-blue-400" />
                      ) : (
                        <Lock className="h-3 w-3 text-zinc-500" />
                      )}
                      Publicly Listed
                    </Label>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {formData.is_listed
                      ? "Visible to everyone on the main tournaments list."
                      : "Hidden. Only accessible via direct link (good for drafts)."}
                  </p>
                </div>
                <Switch
                  checked={formData.is_listed}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, is_listed: v })
                  }
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 mt-4 text-base shadow-lg shadow-primary/20"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-5 w-5" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-zinc-950 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete {deleteTarget === "banner" ? "Banner" : "Logo"}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently remove the file from storage. The image will
              no longer be visible on the public page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 text-white hover:bg-red-700 border-none"
            >
              Yes, Delete It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
