import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { createMatchAPI } from "@/api/matches";
import { toast } from "sonner";

import type { Team } from "@/api/teams";

interface MatchCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: string;
  availableTeams: Team[];
  onSuccess: () => void;
}

export function MatchCreatorDialog({
  open,
  onOpenChange,
  tournamentId,
  availableTeams,
  onSuccess,
}: MatchCreatorDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    stage: "groups",
    group_name: "A",
    round: 1,
    teamAId: "",
    teamBId: "",
    bestOf: 1,
    scheduledAt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMatchAPI(tournamentId, {
        ...formData,
        teamAId: formData.teamAId ? Number(formData.teamAId) : null,
        teamBId: formData.teamBId ? Number(formData.teamBId) : null,
        scheduled_time: formData.scheduledAt
          ? new Date(formData.scheduledAt).toISOString()
          : null,
      });
      toast.success("Match created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New Match
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(v) => setFormData({ ...formData, stage: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="groups">Group Stage</SelectItem>
                  <SelectItem value="playoffs">Playoffs</SelectItem>
                  <SelectItem value="play-in">Play-In</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.stage === "groups" && (
              <div className="space-y-2">
                <Label>Group</Label>
                <Input
                  value={formData.group_name}
                  onChange={(e) =>
                    setFormData({ ...formData, group_name: e.target.value })
                  }
                  className="bg-zinc-900 border-white/10"
                  placeholder="A, B, etc."
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-blue-400">Blue Side (Team A)</Label>
              <Select
                value={formData.teamAId}
                onValueChange={(v) => setFormData({ ...formData, teamAId: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-white/10">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  {availableTeams.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-red-400">Red Side (Team B)</Label>
              <Select
                value={formData.teamBId}
                onValueChange={(v) => setFormData({ ...formData, teamBId: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-white/10">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  {availableTeams.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Best Of</Label>
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
              <Label>Schedule Date</Label>
              <Input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledAt: e.target.value })
                }
                className="bg-zinc-900 border-white/10"
              />
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
            <Button type="submit" disabled={loading} className="bg-primary">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Match
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
