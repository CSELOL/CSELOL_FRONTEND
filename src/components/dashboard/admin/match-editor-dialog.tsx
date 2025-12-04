import { useState, useEffect } from "react";
import { Swords, Save, Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateMatchAPI } from "@/api/matches";
import { toast } from "sonner";

type Team = { id: number; name: string };
type Match = {
  id?: number;
  round: number;
  matchIndex: number;
  teamAId: number | null;
  teamBId: number | null;
  scoreA: number;
  scoreB: number;
  scheduledAt: string;
  status: "scheduled" | "live" | "completed";
  bestOf: number;
  metadata?: {
    notes?: string;
  };
};

interface MatchEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchToEdit?: any;
  availableTeams: Team[];
  onSuccess: () => void;
}

export function MatchEditorDialog({
  open,
  onOpenChange,
  matchToEdit,
  availableTeams,
  onSuccess,
}: MatchEditorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Match>({
    id: 0,
    round: 1,
    matchIndex: 0,
    teamAId: null,
    teamBId: null,
    scoreA: 0,
    scoreB: 0,
    scheduledAt: "",
    status: "scheduled",
    bestOf: 1,
    metadata: { notes: "" },
  });

  useEffect(() => {
    if (matchToEdit) {
      setFormData({
        id: matchToEdit.id,
        round: matchToEdit.round,
        matchIndex: matchToEdit.matchIndex,
        teamAId: matchToEdit.teamAId,
        teamBId: matchToEdit.teamBId,
        scoreA: matchToEdit.scoreA || 0,
        scoreB: matchToEdit.scoreB || 0,
        status: matchToEdit.status || "scheduled",
        scheduledAt: matchToEdit.scheduledAt
          ? new Date(matchToEdit.scheduledAt).toISOString().slice(0, 16)
          : "",
        bestOf: matchToEdit.bestOf || 1,
        metadata: matchToEdit.metadata || { notes: "" },
      });
    }
  }, [matchToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;

    setIsLoading(true);
    try {
      await updateMatchAPI(formData.id, {
        teamAId: formData.teamAId,
        teamBId: formData.teamBId,
        scoreA: formData.scoreA,
        scoreB: formData.scoreB,
        scheduledAt: formData.scheduledAt
          ? new Date(formData.scheduledAt).toISOString()
          : null,
        status: formData.status,
        bestOf: formData.bestOf,
        metadata: formData.metadata, // Send notes
      });
      toast.success("Match updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update match");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            Match Manager #{formData.id}
          </DialogTitle>
          {/* FIX: Added DialogDescription */}
          <div className="text-sm text-zinc-400">
            Edit match details, scores, and schedule.
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Status & Schedule */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-900/50 rounded-lg border border-white/5">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase font-bold">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(v: any) =>
                  setFormData({ ...formData, status: v })
                }
              >
                <SelectTrigger className="bg-zinc-900 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase font-bold">
                Format
              </Label>
              <Select
                value={formData.bestOf.toString()}
                onValueChange={(v) =>
                  setFormData({ ...formData, bestOf: parseInt(v) })
                }
              >
                <SelectTrigger className="bg-zinc-900 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="1">Best of 1</SelectItem>
                  <SelectItem value="3">Best of 3</SelectItem>
                  <SelectItem value="5">Best of 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase font-bold">
                Date & Time
              </Label>
              <Input
                type="datetime-local"
                className="bg-zinc-900 border-white/10 text-white text-xs"
                value={formData.scheduledAt}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledAt: e.target.value })
                }
              />
            </div>
          </div>

          {/* Teams & Scores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              {/* Blue Side */}
              <div className="flex-1 space-y-2">
                <Label className="text-blue-400 text-xs uppercase font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>{" "}
                  Blue Side
                </Label>
                <Select
                  value={formData.teamAId?.toString() || "null"}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      teamAId: v === "null" ? null : Number(v),
                    })
                  }
                >
                  <SelectTrigger className="bg-zinc-900 border-blue-500/30 h-12 text-lg font-bold">
                    <SelectValue placeholder="TBD" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="null">TBD</SelectItem>
                    {availableTeams.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex items-end pb-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-white/10 hover:bg-white/10"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      teamAId: formData.teamBId,
                      teamBId: formData.teamAId,
                      scoreA: formData.scoreB,
                      scoreB: formData.scoreA,
                    })
                  }
                  title="Swap Sides"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Red Side */}
              <div className="flex-1 space-y-2 text-right">
                <Label className="text-red-400 text-xs uppercase font-bold flex items-center justify-end gap-2">
                  Red Side{" "}
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                </Label>
                <Select
                  value={formData.teamBId?.toString() || "null"}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      teamBId: v === "null" ? null : Number(v),
                    })
                  }
                >
                  <SelectTrigger className="bg-zinc-900 border-red-500/30 h-12 text-lg font-bold text-right">
                    <SelectValue placeholder="TBD" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="null">TBD</SelectItem>
                    {availableTeams.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Score Inputs */}
            <div className="flex items-center justify-center gap-6">
              <Input
                type="number"
                className="w-20 h-14 text-center bg-black/40 border-blue-500/50 font-mono text-3xl font-bold focus:border-blue-500"
                value={formData.scoreA}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scoreA: parseInt(e.target.value),
                  })
                }
              />
              <span className="text-2xl font-bold text-zinc-600">-</span>
              <Input
                type="number"
                className="w-20 h-14 text-center bg-black/40 border-red-500/50 font-mono text-3xl font-bold focus:border-red-500"
                value={formData.scoreB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scoreB: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Referee Notes / Metadata */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-4 w-4" /> Referee Notes / Penalties
            </Label>
            <Textarea
              className="bg-black/20 border-white/10 min-h-[80px]"
              placeholder="e.g. Team A penalized for late arrival. Pause due to technical issue."
              value={formData.metadata?.notes || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metadata: { ...formData.metadata, notes: e.target.value },
                })
              }
            />
            <p className="text-xs text-zinc-500">
              These notes will be visible to players on the match details page.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary font-bold text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
