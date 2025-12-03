import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTeamMembersAPI } from "@/api/teams";
import { Loader2, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TeamRosterDialogProps {
  teamId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeamRosterDialog({
  teamId,
  isOpen,
  onClose,
}: TeamRosterDialogProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && teamId) {
      const loadMembers = async () => {
        setIsLoading(true);
        try {
          const data = await getTeamMembersAPI(teamId);
          setMembers(data);
        } catch (error) {
          console.error("Failed to load roster", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadMembers();
    } else {
      setMembers([]);
    }
  }, [isOpen, teamId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" /> Team Roster
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              No members found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5"
                >
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.nickname}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-zinc-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {member.nickname}
                      </span>
                      {member.team_role === "CAPTAIN" && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-4 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                        >
                          CPT
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 border-white/10 text-zinc-400"
                      >
                        {member.primary_role}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
