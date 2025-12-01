import { useState, useEffect } from "react";
import { Swords, Save, Loader2, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  bestOf: number; // NEW FIELD
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
    bestOf: 1, // Default
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
        bestOf: matchToEdit.bestOf || 1, // Load Best Of
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
        bestOf: formData.bestOf, // Send to API
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
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            Edit Match #{formData.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4">
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
                Date
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

          <Separator className="bg-white/10" />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              {/* Blue Side */}
              <div className="flex-1 space-y-2">
                <Label className="text-blue-400 text-xs uppercase font-bold">
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
                  <SelectTrigger className="bg-zinc-900 border-white/10">
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

              {/* Scores */}
              <div className="flex items-end gap-2 pb-1">
                <Input
                  type="number"
                  className="w-12 text-center bg-black/40 border-white/10 font-mono text-lg"
                  value={formData.scoreA}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scoreA: parseInt(e.target.value),
                    })
                  }
                />
                <span className="font-bold text-zinc-500 mb-2">:</span>
                <Input
                  type="number"
                  className="w-12 text-center bg-black/40 border-white/10 font-mono text-lg"
                  value={formData.scoreB}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scoreB: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              {/* Red Side */}
              <div className="flex-1 space-y-2">
                <Label className="text-red-400 text-xs uppercase font-bold">
                  Red Side
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
                  <SelectTrigger className="bg-zinc-900 border-white/10">
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
              className="bg-primary font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
