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
import { createMatchAPI } from "@/api/matches";
import { toast } from "sonner";

import type { Team } from "@/api/teams";

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
  const [startDate, setStartDate] = useState("");
  const [bestOf, setBestOf] = useState(1);

  const generateSchedule = async () => {
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }
    setLoading(true);
    try {
      const matchesToCreate: any[] = [];
      const startDateTime = new Date(startDate);

      groups.forEach((group) => {
        const teams = group.teams;
        if (teams.length < 2) return;

        // Round Robin Logic
        // Simple algorithm: each team plays every other team once
        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            // Create match object
            matchesToCreate.push({
              stage: "groups",
              group_name: group.name.replace("Group ", ""), // Ensure clean name
              round: 1, // Simplified, ideally we calculate rounds
              teamAId: teams[i].id,
              teamBId: teams[j].id,
              bestOf: bestOf,
              scheduled_time: startDateTime.toISOString(), // All start at same time for now, admin can adjust
              status: "scheduled",
            });
          }
        }
      });

      // Execute creation (sequentially to avoid rate limits/race conditions if any)
      // In a real app, backend bulk create is better, but per requirements we use createMatchAPI
      let successCount = 0;
      for (const match of matchesToCreate) {
        try {
          await createMatchAPI(tournamentId, match);
          successCount++;
        } catch (e) {
          console.error("Failed to create match", match, e);
        }
      }

      toast.success(`Generated ${successCount} matches!`);
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast.error("Failed to generate schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Calendar className="mr-2 h-4 w-4" /> Generate Schedule
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Generate Group Stage Schedule</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-zinc-400">
              This will create Round Robin matches for all groups. Existing
              matches will NOT be deleted automatically.
            </p>

            <div className="space-y-2">
              <Label>Start Date & Time</Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-zinc-900 border-white/10"
              />
            </div>

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
