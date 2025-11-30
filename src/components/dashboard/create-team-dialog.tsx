import * as React from "react";
import {
  Upload,
  Loader2,
  Shield,
  Hash,
  Twitter,
  Youtube,
  Twitch,
  Image as ImageIcon,
  MessageSquare,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createTeamAPI } from "@/api/teams";
import { uploadLogo } from "@/services/storage-service"; // Only importing upload

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamDialog({
  open,
  onOpenChange,
}: CreateTeamDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Form State
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [description, setDescription] = React.useState("");

  // --- IMAGE STATE ---
  const [logoUrl, setLogoUrl] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Socials State
  const [twitter, setTwitter] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  const [twitch, setTwitch] = React.useState("");
  const [youtube, setYoutube] = React.useState("");
  const [discord, setDiscord] = React.useState("");

  // 1. Handle File Upload (Safe Mode: No Delete)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simply upload the new file.
      // If an old file existed, we leave it (orphan) to avoid security risks.
      const publicUrl = await uploadLogo(file);
      setLogoUrl(publicUrl);
    } catch (error) {
      alert("Failed to upload image.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // 2. Handle Remove (UI Only)
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Just clear the state. No server request needed.
    setLogoUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const teamPayload = {
      name,
      tag,
      description,
      logo_url: logoUrl,
      social_media: {
        twitter: twitter || null,
        instagram: instagram || null,
        twitch: twitch || null,
        youtube: youtube || null,
        others: discord ? [discord] : [],
      },
    };

    try {
      await createTeamAPI(teamPayload);
      onOpenChange(false);

      // Reset Form
      setName("");
      setTag("");
      setDescription("");
      setLogoUrl("");
      setTwitter("");
      setInstagram("");
      setTwitch("");
      setYoutube("");
      setDiscord("");

      // Reload page to show new team (or use context/state in a real app)
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to create team. Name or Tag might be taken.");
    } finally {
      setIsLoading(false);
    }
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
            Establish your organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="py-4">
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-white/5 mb-4">
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="socials">Socials & Bio</TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="space-y-6">
              {/* --- IMAGE UPLOAD UI --- */}
              <div className="flex flex-col items-center justify-center gap-3 py-4">
                <div
                  className="relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-primary/50 hover:bg-primary/10 overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-zinc-400" />
                          <span className="mt-1 text-[10px] text-zinc-500">
                            Upload
                          </span>
                        </>
                      )}
                    </>
                  )}
                  {/* Hidden Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {logoUrl && !isUploading && (
                  <button
                    type="button"
                    className="text-xs text-red-400 hover:underline"
                    onClick={handleRemoveImage}
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Team Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-900/50 border-white/10"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tag</Label>
                  <div className="relative">
                    <Input
                      value={tag}
                      onChange={(e) => setTag(e.target.value.toUpperCase())}
                      maxLength={4}
                      className="bg-zinc-900/50 border-white/10 pl-9 uppercase"
                      required
                    />
                    <Hash className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="socials" className="space-y-4">
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-zinc-900/50 border-white/10 min-h-[80px]"
                />
              </div>
              <div className="grid gap-3 mt-4">
                <Label className="text-zinc-300">Social Media Links</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Twitter URL"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="pl-9 bg-zinc-900/50 border-white/10"
                  />
                </div>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Instagram URL"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="pl-9 bg-zinc-900/50 border-white/10"
                  />
                </div>
                <div className="relative">
                  <Twitch className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Twitch URL"
                    value={twitch}
                    onChange={(e) => setTwitch(e.target.value)}
                    className="pl-9 bg-zinc-900/50 border-white/10"
                  />
                </div>
                <div className="relative">
                  <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Youtube URL"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="pl-9 bg-zinc-900/50 border-white/10"
                  />
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Discord Invite"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    className="pl-9 bg-zinc-900/50 border-white/10"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="bg-primary text-primary-foreground font-bold"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Register Team"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
