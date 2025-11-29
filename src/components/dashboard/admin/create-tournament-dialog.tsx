import * as React from "react";
import {
  Trophy,
  Calendar,
  Loader2,
  Image,
  Globe,
  Shield,
  Users,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTournamentAPI } from "@/api/tournaments";

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

  // State matches your DB Schema
  const [formData, setFormData] = React.useState({
    tournament_name: "",
    tournament_description: "",
    start_date: "",
    banner_url: "",
    logo_url: "",
    format: "single_elimination",
    has_lower_bracket: false,
    is_listed: true,
    allow_signups: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Prepare Payload matching your Database Columns exactly
      const payload = {
        tournament_name: formData.tournament_name,
        tournament_description: formData.tournament_description,
        start_date: formData.start_date
          ? new Date(formData.start_date).toISOString()
          : null,
        format: formData.format,
        has_lower_bracket: formData.has_lower_bracket,
        is_listed: formData.is_listed,
        allow_signups: formData.allow_signups,
        banner_url: formData.banner_url || null,
        logo_url: formData.logo_url || null,
        // Defaults managed by backend or logic:
        status: "scheduled",
        is_archived: false,
        organizer_id: 1, // Replace with actual user ID from Auth context if available
      };

      // 2. Call API
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
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-red-500" />
            Create Tournament
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter the details for the new competitive event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="py-4 space-y-5">
          {/* --- NAME & DESCRIPTION --- */}
          <div className="grid gap-2">
            <Label className="text-zinc-300">Tournament Name</Label>
            <Input
              required
              placeholder="e.g. CSELOL Season 5"
              className="bg-zinc-900/50 border-white/10"
              value={formData.tournament_name}
              onChange={(e) => handleChange("tournament_name", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-zinc-300">Description</Label>
            <Textarea
              placeholder="Brief summary..."
              className="bg-zinc-900/50 border-white/10 resize-none h-20"
              value={formData.tournament_description}
              onChange={(e) =>
                handleChange("tournament_description", e.target.value)
              }
            />
          </div>

          {/* --- DATES & FORMAT --- */}
          <div className="grid grid-cols-2 gap-4">
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
            <div className="grid gap-2">
              <Label className="text-zinc-300">Format</Label>
              <Select
                value={formData.format}
                onValueChange={(v) => handleChange("format", v)}
              >
                <SelectTrigger className="bg-zinc-900/50 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="single_elimination">
                    Single Elimination
                  </SelectItem>
                  <SelectItem value="double_elimination">
                    Double Elimination
                  </SelectItem>
                  <SelectItem value="round_robin">Round Robin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* --- IMAGES --- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-zinc-300">Banner URL</Label>
              <div className="relative">
                <Image className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="https://..."
                  className="bg-zinc-900/50 border-white/10 pl-9"
                  value={formData.banner_url}
                  onChange={(e) => handleChange("banner_url", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-300">Logo URL</Label>
              <div className="relative">
                <Image className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="https://..."
                  className="bg-zinc-900/50 border-white/10 pl-9"
                  value={formData.logo_url}
                  onChange={(e) => handleChange("logo_url", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* --- BOOLEAN TOGGLES --- */}
          <div className="grid gap-4 pt-2">
            <div className="flex items-center justify-between rounded-md border border-white/10 bg-zinc-900/50 p-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Publicly Listed?</span>
              </div>
              <Switch
                checked={formData.is_listed}
                onCheckedChange={(v) => handleChange("is_listed", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-white/10 bg-zinc-900/50 p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Allow Signups?</span>
              </div>
              <Switch
                checked={formData.allow_signups}
                onCheckedChange={(v) => handleChange("allow_signups", v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-white/10 bg-zinc-900/50 p-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">
                  Has Lower Bracket?
                </span>
              </div>
              <Switch
                checked={formData.has_lower_bracket}
                onCheckedChange={(v) => handleChange("has_lower_bracket", v)}
              />
            </div>
          </div>

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
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Tournament
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
