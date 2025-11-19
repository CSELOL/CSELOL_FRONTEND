import * as React from "react";
import { Upload, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamDialog({
  open,
  onOpenChange,
}: CreateTeamDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("");

  // Mock API Call
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      // Here you would normally refresh the dashboard data
      alert(`Team ${name} [${tag}] created successfully!`);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Register New Team
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create your organization. You will automatically be assigned as the
            Captain.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-6 py-4">
          {/* Logo Upload Mockup */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-primary/50 hover:bg-primary/10">
              <Upload className="h-6 w-6 text-zinc-400" />
              <span className="mt-1 text-[10px] text-zinc-500">
                Upload Logo
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-300">
                Team Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Sergipe Slayers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900/50 border-white/10 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag" className="text-zinc-300">
                Tag (2-4 Characters)
              </Label>
              <div className="relative">
                <Input
                  id="tag"
                  placeholder="SLY"
                  maxLength={4}
                  value={tag}
                  onChange={(e) => setTag(e.target.value.toUpperCase())}
                  className="bg-zinc-900/50 border-white/10 focus-visible:ring-primary uppercase font-mono"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-zinc-500">
                  {tag.length}/4
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground font-bold"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
