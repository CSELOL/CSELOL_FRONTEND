import { useState, useEffect } from "react";
import { Calendar, Trophy, Save, Swords } from "lucide-react";
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

// Types (In a real app, these come from your API types)
type Team = { id: string; name: string };
type Match = {
  id?: string;
  round: string;
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
  date: string;
  status: "Scheduled" | "Live" | "Finished";
};

interface MatchEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchToEdit?: Match | null; // If null, we are creating a new match
  availableTeams: Team[]; // List of approved teams to pick from
}

export function MatchEditorDialog({ 
  open, 
  onOpenChange, 
  matchToEdit, 
  availableTeams 
}: MatchEditorDialogProps) {
  
  // Form State
  const [formData, setFormData] = useState<Match>({
    round: "Group Stage",
    teamAId: "",
    teamBId: "",
    scoreA: 0,
    scoreB: 0,
    date: "",
    status: "Scheduled",
  });

  // Load data when editing
  useEffect(() => {
    if (matchToEdit) {
      setFormData(matchToEdit);
    } else {
      // Reset if creating new
      setFormData({
        round: "Group Stage",
        teamAId: "",
        teamBId: "",
        scoreA: 0,
        scoreB: 0,
        date: "",
        status: "Scheduled",
      });
    }
  }, [matchToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Match Data:", formData);
    // Here you would call API: POST /matches (create) or PUT /matches/:id (update)
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            {matchToEdit ? "Edit Match Details" : "Schedule New Match"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          {/* 1. Logistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase font-bold">Round / Phase</Label>
                <Select 
                    value={formData.round} 
                    onValueChange={(v) => setFormData({...formData, round: v})}
                >
                    <SelectTrigger className="bg-zinc-900 border-white/10">
                        <SelectValue placeholder="Select Round" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="Group Stage">Group Stage</SelectItem>
                        <SelectItem value="Quarterfinals">Quarterfinals</SelectItem>
                        <SelectItem value="Semifinals">Semifinals</SelectItem>
                        <SelectItem value="Grand Finals">Grand Finals</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase font-bold">Schedule Date</Label>
                <div className="relative">
                    <Input 
                        type="datetime-local"
                        className="bg-zinc-900 border-white/10" // Remove pl-9 if icon alignment is tricky
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* 2. Teams & Scores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                {/* Team A */}
                <div className="flex-1 space-y-2">
                    <Label className="text-blue-400 text-xs uppercase font-bold">Blue Side</Label>
                    <Select 
                        value={formData.teamAId} 
                        onValueChange={(v) => setFormData({...formData, teamAId: v})}
                    >
                        <SelectTrigger className="bg-zinc-900 border-white/10">
                            <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            {availableTeams.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* VS Score */}
                <div className="flex items-end gap-2 pb-1">
                    <Input 
                        type="number" 
                        className="w-12 text-center bg-black/40 border-white/10 font-mono font-bold text-lg"
                        value={formData.scoreA}
                        onChange={(e) => setFormData({...formData, scoreA: parseInt(e.target.value)})}
                    />
                    <span className="font-bold text-zinc-500 mb-2">:</span>
                    <Input 
                        type="number" 
                        className="w-12 text-center bg-black/40 border-white/10 font-mono font-bold text-lg"
                        value={formData.scoreB}
                        onChange={(e) => setFormData({...formData, scoreB: parseInt(e.target.value)})}
                    />
                </div>

                {/* Team B */}
                <div className="flex-1 space-y-2">
                    <Label className="text-red-400 text-xs uppercase font-bold">Red Side</Label>
                    <Select 
                        value={formData.teamBId} 
                        onValueChange={(v) => setFormData({...formData, teamBId: v})}
                    >
                        <SelectTrigger className="bg-zinc-900 border-white/10">
                            <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                            {availableTeams.map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>

          {/* 3. Status */}
          <div className="space-y-2">
             <Label className="text-zinc-400 text-xs uppercase font-bold">Match Status</Label>
             <div className="flex gap-2">
                {["Scheduled", "Live", "Finished"].map((status) => (
                    <div 
                        key={status}
                        onClick={() => setFormData({...formData, status: status as any})}
                        className={`flex-1 cursor-pointer rounded border px-3 py-2 text-center text-sm font-bold transition-all ${
                            formData.status === status 
                                ? "bg-primary text-primary-foreground border-primary" 
                                : "bg-zinc-900 text-zinc-500 border-white/10 hover:bg-zinc-800"
                        }`}
                    >
                        {status}
                    </div>
                ))}
             </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary font-bold">
                <Save className="mr-2 h-4 w-4" /> Save Match
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}