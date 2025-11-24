import * as React from "react";
import { Upload, Loader2, Shield, Hash, AtSign, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Need to install if missing
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  // State
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [bio, setBio] = React.useState("");
  
  // Socials State
  const [twitter, setTwitter] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  const [discord, setDiscord] = React.useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Construct the payload
    const teamPayload = {
        name,
        tag,
        bio,
        socials: {
            twitter,
            instagram,
            discord
        }
        // logo would be handled via file upload logic
    };

    console.log("Creating Team:", teamPayload);

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      alert(`Team ${name} [${tag}] created successfully!`);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            Register New Team
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Establish your organization. You can edit these details later in settings.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="py-4">
          
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-white/5 mb-4">
                <TabsTrigger value="identity">Identity</TabsTrigger>
                <TabsTrigger value="socials">Socials & Bio</TabsTrigger>
            </TabsList>

            {/* --- TAB 1: BASIC IDENTITY --- */}
            <TabsContent value="identity" className="space-y-6">
                {/* Logo Upload Mockup */}
                <div className="flex flex-col items-center justify-center gap-3 py-4">
                    <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-primary/50 hover:bg-primary/10 relative group overflow-hidden">
                        <Upload className="h-6 w-6 text-zinc-400 group-hover:text-primary" />
                        <span className="mt-1 text-[10px] text-zinc-500">Upload Logo</span>
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-zinc-300">Team Name</Label>
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
                        <Label htmlFor="tag" className="text-zinc-300">Tag (2-4 Characters)</Label>
                        <div className="relative">
                            <Input
                                id="tag"
                                placeholder="SLY"
                                maxLength={4}
                                value={tag}
                                onChange={(e) => setTag(e.target.value.toUpperCase())}
                                className="bg-zinc-900/50 border-white/10 focus-visible:ring-primary uppercase font-mono pl-9"
                                required
                            />
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                            <span className="absolute right-3 top-2.5 text-xs text-zinc-500">
                                {tag.length}/4
                            </span>
                        </div>
                    </div>
                </div>
            </TabsContent>

            {/* --- TAB 2: SOCIALS & BIO --- */}
            <TabsContent value="socials" className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-zinc-300">Description (Bio)</Label>
                    <Textarea 
                        id="bio" 
                        placeholder="Tell us about your team..." 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-zinc-900/50 border-white/10 focus-visible:ring-primary min-h-[80px]"
                    />
                </div>

                <div className="grid gap-3 mt-4">
                    <Label className="text-zinc-300">Social Media</Label>
                    
                    <div className="relative">
                        <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Twitter / X Handle"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            className="pl-9 bg-zinc-900/50 border-white/10 focus-visible:ring-primary"
                        />
                    </div>
                    
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Instagram Handle"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            className="pl-9 bg-zinc-900/50 border-white/10 focus-visible:ring-primary"
                        />
                    </div>

                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Discord Invite Link"
                            value={discord}
                            onChange={(e) => setDiscord(e.target.value)}
                            className="pl-9 bg-zinc-900/50 border-white/10 focus-visible:ring-primary"
                        />
                    </div>
                </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
             <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
                Cancel
             </Button>
             <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground font-bold">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Team
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}