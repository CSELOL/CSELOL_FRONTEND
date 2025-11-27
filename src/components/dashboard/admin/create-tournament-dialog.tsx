import * as React from "react";
import { 
  Trophy, 
  Calendar, 
  Users, 
  ScrollText, 
  DollarSign, 
  Save, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface CreateTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTournamentDialog({ open, onOpenChange }: CreateTournamentDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    season: "Season 5",
    description: "",
    format: "Single Elimination",
    teamSize: "5",
    maxTeams: "16",
    startDate: "",
    regCloseDate: "",
    prizePool: "",
    entryFee: "0",
    minRank: "Unranked",
    rulesUrl: "",
    isPublic: false
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Call
    console.log("Creating Tournament:", formData);

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      // In real app: Refresh list, show toast success
    }, 1500);
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
            Configure the settings for the new competitive event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="py-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border border-white/5 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="format">Format</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            {/* --- TAB 1: GENERAL --- */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-zinc-300">Tournament Name</Label>
                <Input 
                  placeholder="e.g. Winter Split 2025" 
                  className="bg-zinc-900/50 border-white/10"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-zinc-300">Description (Short)</Label>
                <Textarea 
                  placeholder="Brief overview for the card display..." 
                  className="bg-zinc-900/50 border-white/10 resize-none"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label className="text-zinc-300">Season / Series</Label>
                    <Input 
                      placeholder="Season 5" 
                      className="bg-zinc-900/50 border-white/10"
                      value={formData.season}
                      onChange={(e) => handleChange("season", e.target.value)}
                    />
                 </div>
                 <div className="grid gap-2">
                    <Label className="text-zinc-300">Visibility</Label>
                    <div className="flex items-center justify-between rounded-md border border-white/10 bg-zinc-900/50 p-3">
                        <span className="text-sm text-zinc-400">Publicly Listed</span>
                        <Switch 
                            checked={formData.isPublic}
                            onCheckedChange={(v) => handleChange("isPublic", v)}
                        />
                    </div>
                 </div>
              </div>
            </TabsContent>

            {/* --- TAB 2: FORMAT & SCHEDULE --- */}
            <TabsContent value="format" className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Bracket Type</Label>
                    <Select value={formData.format} onValueChange={(v) => handleChange("format", v)}>
                      <SelectTrigger className="bg-zinc-900/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="Single Elimination">Single Elimination</SelectItem>
                        <SelectItem value="Double Elimination">Double Elimination</SelectItem>
                        <SelectItem value="Round Robin">Round Robin</SelectItem>
                        <SelectItem value="Swiss">Swiss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Max Teams</Label>
                    <Select value={formData.maxTeams} onValueChange={(v) => handleChange("maxTeams", v)}>
                      <SelectTrigger className="bg-zinc-900/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="8">8 Teams</SelectItem>
                        <SelectItem value="16">16 Teams</SelectItem>
                        <SelectItem value="32">32 Teams</SelectItem>
                        <SelectItem value="64">64 Teams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Start Date</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input 
                            type="datetime-local" 
                            className="bg-zinc-900/50 border-white/10 pl-9 text-sm" 
                            value={formData.startDate}
                            onChange={(e) => handleChange("startDate", e.target.value)}
                        />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-zinc-300">Registration Deadline</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input 
                            type="datetime-local" 
                            className="bg-zinc-900/50 border-white/10 pl-9 text-sm"
                            value={formData.regCloseDate}
                            onChange={(e) => handleChange("regCloseDate", e.target.value)}
                        />
                    </div>
                  </div>
               </div>

               <div className="grid gap-2">
                  <Label className="text-zinc-300">Minimum Rank Requirement</Label>
                  <Select value={formData.minRank} onValueChange={(v) => handleChange("minRank", v)}>
                      <SelectTrigger className="bg-zinc-900/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="Unranked">Open (Any Rank)</SelectItem>
                        <SelectItem value="Gold">Gold+</SelectItem>
                        <SelectItem value="Diamond">Diamond+</SelectItem>
                        <SelectItem value="Master">Master+</SelectItem>
                      </SelectContent>
                    </Select>
               </div>
            </TabsContent>

            {/* --- TAB 3: DETAILS & PRIZES --- */}
            <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-zinc-300">Prize Pool (Display)</Label>
                        <div className="relative">
                            <Trophy className="absolute left-3 top-2.5 h-4 w-4 text-yellow-500" />
                            <Input 
                                placeholder="e.g. R$ 5.000" 
                                className="bg-zinc-900/50 border-white/10 pl-9"
                                value={formData.prizePool}
                                onChange={(e) => handleChange("prizePool", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-zinc-300">Entry Fee</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500" />
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="bg-zinc-900/50 border-white/10 pl-9"
                                value={formData.entryFee}
                                onChange={(e) => handleChange("entryFee", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label className="text-zinc-300">Rulebook URL</Label>
                    <div className="relative">
                        <ScrollText className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input 
                            placeholder="https://docs.google.com/..." 
                            className="bg-zinc-900/50 border-white/10 pl-9"
                            value={formData.rulesUrl}
                            onChange={(e) => handleChange("rulesUrl", e.target.value)}
                        />
                    </div>
                </div>
            </TabsContent>

          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white font-bold">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Tournament
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}