import { useState, Fragment } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Users,
  Instagram,
  Twitter,
  Globe,
  ExternalLink,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TeamManagementProps {
  teams: any[];
  onUpdateStatus: (
    regId: number,
    status: "APPROVED" | "REJECTED",
    reason?: string
  ) => void;
  onViewProof: (regId: number) => void;
}

export function TournamentTeamManagement({
  teams,
  onUpdateStatus,
  onViewProof,
}: TeamManagementProps) {
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    regId: number | null;
    teamName: string;
  }>({ open: false, regId: null, teamName: "" });
  const [rejectionReason, setRejectionReason] = useState("");

  const toggleExpand = (id: number) => {
    setExpandedTeamId(expandedTeamId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "APPROVED")
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/50";
    if (s === "REJECTED")
      return "bg-red-500/15 text-red-400 border-red-500/50";
    return "bg-yellow-500/15 text-yellow-400 border-yellow-500/50";
  };

  const renderSocialIcon = (platform: string) => {
    if (platform.includes("instagram"))
      return <Instagram className="h-4 w-4" />;
    if (platform.includes("twitter") || platform.includes("x.com"))
      return <Twitter className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const handleRejectClick = (regId: number, teamName: string) => {
    setRejectDialog({ open: true, regId, teamName });
    setRejectionReason("");
  };

  const confirmReject = () => {
    if (rejectDialog.regId) {
      onUpdateStatus(rejectDialog.regId, "REJECTED", rejectionReason);
      setRejectDialog({ open: false, regId: null, teamName: "" });
    }
  };

  return (
    <>
      <Card className="bg-zinc-900/50 border-white/10 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Participating Teams</CardTitle>
          <Badge variant="outline" className="border-white/10">
            {teams.length} Registered
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {teams.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No teams have registered yet.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Team Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <Fragment key={team.id}>
                    {/* MAIN ROW */}
                    <TableRow
                      className={cn(
                        "border-white/5 transition-colors cursor-pointer",
                        expandedTeamId === team.id
                          ? "bg-white/[0.03]"
                          : "hover:bg-white/[0.02]"
                      )}
                      onClick={() => toggleExpand(team.id)}
                    >
                      <TableCell>
                        {expandedTeamId === team.id ? (
                          <ChevronUp className="h-4 w-4 text-zinc-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-zinc-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-white/10">
                            <AvatarImage src={team.logo_url} />
                            <AvatarFallback className="bg-zinc-800 font-bold text-zinc-400">
                              {team.tag}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-white">
                              {team.name}
                            </div>
                            <div className="text-xs text-zinc-500 font-mono uppercase">
                              {team.tag}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(team.registration_status)}
                        >
                          {team.registration_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">
                        {new Date(team.registered_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {team.registration_status === "PENDING" ||
                        team.registration_status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 h-8 w-8 p-0"
                              onClick={() =>
                                onUpdateStatus(team.registration_id, "APPROVED")
                              }
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleRejectClick(
                                  team.registration_id,
                                  team.name
                                )
                              }
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled
                            className="opacity-50"
                          >
                            <span className="text-xs">Processed</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>

                    {/* EXPANDED ROW DETAILS */}
                    {expandedTeamId === team.id && (
                      <TableRow className="hover:bg-transparent border-white/5 bg-black/20 shadow-inner">
                        <TableCell colSpan={5} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* 1. TEAM INFO */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-white/5 pb-2">
                                <Info className="h-4 w-4" /> About
                              </div>
                              <p className="text-sm text-zinc-400 leading-relaxed">
                                {team.description ||
                                  "No description provided by the team."}
                              </p>
                              {team.social_media && (
                                <div className="flex gap-2 mt-2">
                                  {Object.entries(team.social_media).map(
                                    ([key, url]: any) => (
                                      <a
                                        href={url}
                                        target="_blank"
                                        key={key}
                                        className="p-2 bg-white/5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                      >
                                        {renderSocialIcon(key)}
                                      </a>
                                    )
                                  )}
                                </div>
                              )}
                            </div>

                            {/* 2. ROSTER */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-white/5 pb-2">
                                <Users className="h-4 w-4" /> Active Roster
                              </div>
                              <div className="space-y-2">
                                {team.roster && team.roster.length > 0 ? (
                                  team.roster.map((player: any) => (
                                    <div
                                      key={player.id}
                                      className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={player.avatar_url}
                                          />
                                          <AvatarFallback className="text-[10px]">
                                            {player.nickname?.[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-zinc-200 font-medium">
                                          {player.nickname}
                                        </span>
                                      </div>
                                      <Badge
                                        variant="secondary"
                                        className="text-[10px] h-5 bg-black/40 text-zinc-400 border-none"
                                      >
                                        {player.role}
                                      </Badge>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-zinc-500 text-xs italic">
                                    No players found.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 3. PROOF & ADMIN */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-white/5 pb-2">
                                <CheckCircle2 className="h-4 w-4" />{" "}
                                Registration Proof
                              </div>

                              <div className="rounded-lg border border-white/10 bg-black/40 p-1 flex flex-col items-center justify-center h-40 relative group overflow-hidden">
                                {team.payment_proof_url ? (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <img
                                        src={team.payment_proof_url}
                                        className="h-full w-full object-cover rounded opacity-80 hover:opacity-100 transition-opacity cursor-zoom-in"
                                      />
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-950 border-white/10 max-w-4xl p-0 overflow-hidden">
                                      <DialogHeader className="sr-only">
                                        <DialogTitle>Payment Proof</DialogTitle>
                                        <DialogDescription>
                                          Receipt uploaded by the team.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <img
                                        src={team.payment_proof_url}
                                        className="w-full h-full"
                                      />
                                    </DialogContent>
                                  </Dialog>
                                ) : (
                                  <div className="text-zinc-600 text-xs">
                                    No Proof Uploaded
                                  </div>
                                )}
                              </div>

                              {/* Quick Action Buttons */}
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant="outline"
                                  className="w-full border-white/10 hover:bg-white/5"
                                  onClick={() =>
                                    onViewProof(team.registration_id)
                                  }
                                >
                                  <ExternalLink className="h-3 w-3 mr-2" /> Open
                                  Link
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* REJECTION DIALOG */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) =>
          setRejectDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" /> Reject Registration
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              You are about to reject <strong>{rejectDialog.teamName}</strong>.
              Please provide a reason so the team can correct the issue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="e.g., Invalid payment proof, Inappropriate team name..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-zinc-900 border-white/10 text-white min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() =>
                setRejectDialog({ open: false, regId: null, teamName: "" })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
