import * as React from "react";
import {
  Trophy,
  Calendar,
  Loader2,
  Image,
  Upload,
  Globe,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createTournamentAPI } from "@/api/tournaments";
import { uploadTournamentAsset } from "@/services/storage-service"; // New Import

interface CreateTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTournamentDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateTournamentDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Upload States
  const [isUploading, setIsUploading] = React.useState(false);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = React.useState({
    tournament_name: "",
    tournament_description: "",
    start_date: "",
    banner_url: "",
    logo_url: "",
    is_listed: true,
    allow_signups: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Generic Upload Handler
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadTournamentAsset(file, type);
      handleChange(type === "banner" ? "banner_url" : "logo_url", url);
    } catch (error) {
      alert(`Failed to upload ${type}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        start_date: formData.start_date
          ? new Date(formData.start_date).toISOString()
          : null,
        // Defaults for removed fields
        format: "custom",
        has_lower_bracket: false,
        status: "scheduled",
        is_archived: false,
        organizer_id: 1,
      };

      await createTournamentAPI(payload);
      setIsLoading(false);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Error creating tournament:", err);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-zinc-950 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-red-500" /> Create Tournament
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Set up the visuals and basic info.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="py-4 space-y-6">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-white/5 mb-6">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="branding">Visuals & Branding</TabsTrigger>
            </TabsList>

            {/* TAB 1: GENERAL INFO */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-zinc-300">Tournament Name</Label>
                <Input
                  required
                  placeholder="e.g. CSELOL Season 5"
                  className="bg-zinc-900/50 border-white/10"
                  value={formData.tournament_name}
                  onChange={(e) =>
                    handleChange("tournament_name", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                  placeholder="Brief summary..."
                  className="bg-zinc-900/50 border-white/10 resize-none h-24"
                  value={formData.tournament_description}
                  onChange={(e) =>
                    handleChange("tournament_description", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-zinc-300">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    required
                    type="datetime-local"
                    className="bg-zinc-900/50 border-white/10 pl-9"
                    value={formData.start_date}
                    onChange={(e) => handleChange("start_date", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between rounded-md border border-white/10 bg-zinc-900/50 p-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm text-zinc-300">
                      Publicly Listed?
                    </span>
                  </div>
                  <Switch
                    checked={formData.is_listed}
                    onCheckedChange={(v) => handleChange("is_listed", v)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border border-white/10 bg-zinc-900/50 p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm text-zinc-300">
                      Allow Signups?
                    </span>
                  </div>
                  <Switch
                    checked={formData.allow_signups}
                    onCheckedChange={(v) => handleChange("allow_signups", v)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: VISUALS (UPLOADS) */}
            <TabsContent value="branding" className="space-y-6">
              {/* BANNER UPLOAD */}
              <div className="space-y-2">
                <Label>Tournament Banner (1920x400)</Label>
                <div
                  className="relative w-full h-40 rounded-lg border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden group"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  {formData.banner_url ? (
                    <>
                      <img
                        src={formData.banner_url}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-black/80 text-white px-3 py-1 rounded text-xs">
                          Change Banner
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500">
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <Upload className="h-8 w-8 mb-2" />
                      )}
                      <span className="text-xs uppercase font-bold">
                        Click to Upload Banner
                      </span>
                    </div>
                  )}
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, "banner")}
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* LOGO UPLOAD */}
              <div className="space-y-2">
                <Label>Tournament Logo (Square)</Label>
                <div className="flex items-center gap-4">
                  <div
                    className="relative h-32 w-32 rounded-xl border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden group"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {formData.logo_url ? (
                      <img
                        src={formData.logo_url}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-zinc-500">
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <Image className="h-6 w-6 mb-1" />
                        )}
                        <span className="text-[10px] uppercase font-bold">
                          Logo
                        </span>
                      </div>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e, "logo")}
                      disabled={isUploading}
                    />
                  </div>
                  <div className="text-sm text-zinc-500 max-w-[250px]">
                    <p>Recommended: 500x500px.</p>
                    <p>This logo will appear on the cards and match lobbies.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
              Create Tournament
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
