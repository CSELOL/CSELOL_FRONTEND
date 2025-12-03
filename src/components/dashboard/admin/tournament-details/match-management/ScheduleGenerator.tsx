import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { Team } from "@/api/teams";
import { generateGroupMatchesAPI } from "@/api/matches";

interface ScheduleGeneratorProps {
  tournamentId: string;
  groups: { id: string; name: string; teams: Team[] }[];
  onSuccess: () => void;
}

export function ScheduleGenerator({
  tournamentId,
  groups,
  onSuccess,
}: ScheduleGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bestOf, setBestOf] = useState(1);

  const generateSchedule = async () => {
    setLoading(true);
    try {
      await generateGroupMatchesAPI(tournamentId, { groups });
      toast.success("Group matches generated successfully!");
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate group matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Calendar className="mr-2 h-4 w-4" /> Generate Matches
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Generate Group Stage Matches</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-zinc-400">
              This will create Round Robin matches for all groups. Matches will be created as "Pending" and must be manually scheduled.
            </p>

            <div className="space-y-2">
              <Label>Best Of</Label>
              <Input
                type="number"
                value={bestOf}
                onChange={(e) => setBestOf(parseInt(e.target.value))}
                className="bg-zinc-900 border-white/10"
                min={1}
                max={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={generateSchedule} disabled={loading} className="bg-primary">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate Matches"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
