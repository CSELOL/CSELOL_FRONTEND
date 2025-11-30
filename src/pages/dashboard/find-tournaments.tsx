import { useState, useEffect } from "react";
import {
  Calendar,
  Trophy,
  Users,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// APIs
import {
  getTournamentsAPI,
  registerTeamForTournamentAPI,
} from "@/api/tournaments";
import { getMyTeamAPI } from "@/api/teams";
import { uploadPaymentProof } from "@/services/storage-service";

interface Tournament {
  id: number;
  tournament_name: string;
  status: string;
  start_date: string;
  format: string;
  allow_signups: boolean;
  is_listed: boolean;
}

export function DashboardTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myTeam, setMyTeam] = useState<any>(null);

  // Registration State
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Proof Upload State
  const [proofPath, setProofPath] = useState("");
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  // 1. Fetch Data (Tournaments + User's Team Status)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tData, teamData] = await Promise.all([
          getTournamentsAPI(),
          getMyTeamAPI(),
        ]);

        // Filter only Open/Scheduled tournaments for players that are listed
        const openTournaments = tData.filter(
          (t: any) =>
            ["open", "scheduled"].includes(t.status?.toLowerCase()) &&
            t.is_listed
        );

        setTournaments(openTournaments);
        setMyTeam(teamData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Handle Click - Open Modal & Reset Proof
  const handleRegisterClick = (t: Tournament) => {
    setSelectedTournament(t);
    setProofPath("");
    setIsRegisterOpen(true);
  };

  // 3. Handle File Upload
  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProof(true);
    try {
      const path = await uploadPaymentProof(file);
      setProofPath(path);
    } catch (err) {
      alert("Failed to upload proof. Please try again.");
      console.error(err);
    } finally {
      setIsUploadingProof(false);
    }
  };

  // 4. Submit Registration
  const processRegistration = async () => {
    if (!selectedTournament) return;

    if (!proofPath) {
      alert("Please upload a proof of payment to continue.");
      return;
    }

    setIsRegistering(true);

    try {
      // Send tournament ID and the proof path
      await registerTeamForTournamentAPI(selectedTournament.id, proofPath);

      alert(
        "Success! Your team has been registered. Waiting for admin approval."
      );
      setIsRegisterOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to register.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 text-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" /> Loading...
      </div>
    );
  }

  // State: User has no team
  if (!myTeam) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="h-20 w-20 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10">
          <Users className="h-10 w-10 text-zinc-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">No Team Found</h2>
          <p className="text-zinc-400 max-w-md mt-2">
            You must be the captain of a registered team to sign up for
            tournaments.
          </p>
        </div>
        <Button
          asChild
          className="bg-primary text-primary-foreground font-bold"
        >
          <Link to="/dashboard/team">Create a Team</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Find Tournaments</h1>
        <p className="text-zinc-400">
          Select a tournament to register{" "}
          <span className="text-white font-bold">{myTeam.name}</span>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <Card
            key={t.id}
            className="bg-zinc-900/50 border-white/10 flex flex-col"
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge
                  className={t.allow_signups ? "bg-emerald-500" : "bg-zinc-700"}
                >
                  {t.status}
                </Badge>
                <span className="text-xs font-mono text-zinc-500">
                  {t.start_date
                    ? new Date(t.start_date).toLocaleDateString()
                    : "TBD"}
                </span>
              </div>
              <CardTitle className="text-white">{t.tournament_name}</CardTitle>
              <CardDescription>
                Format: {t.format ? t.format.replace("_", " ") : "Standard"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" /> Prize Pool
                  Pending
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {t.allow_signups ? (
                <Button
                  onClick={() => handleRegisterClick(t)}
                  className="w-full bg-primary text-primary-foreground font-bold"
                >
                  Register Team
                </Button>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="w-full border-white/10 text-zinc-500"
                >
                  <Lock className="mr-2 h-4 w-4" /> Closed
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
        {tournaments.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-lg">
            No tournaments open for registration at the moment.
          </div>
        )}
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Registering <strong>{myTeam.name}</strong> for{" "}
              <strong>{selectedTournament?.tournament_name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* 1. Requirements Check */}
            <div className="flex items-start gap-3 p-3 rounded bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>
                VALIDATION TODO Ensure your team has at least{" "}
                <strong>5 members</strong>. The system will reject incomplete
                teams.
              </p>
            </div>

            {/* 2. Payment Proof Upload */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Payment Proof (Required)</Label>
              <div className="flex items-center gap-4">
                {!proofPath ? (
                  <div className="relative flex items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/5 cursor-pointer transition-colors bg-black/20">
                    <div className="flex flex-col items-center gap-1 text-zinc-500">
                      {isUploadingProof ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Upload className="h-6 w-6" />
                      )}
                      <span className="text-xs uppercase font-bold">
                        Upload Receipt (Image/PDF)
                      </span>
                    </div>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleProofUpload}
                      accept="image/*,application/pdf"
                      disabled={isUploadingProof}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm font-bold">
                        Proof Uploaded Successfully
                      </span>
                    </div>
                    <button
                      onClick={() => setProofPath("")}
                      className="text-emerald-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-zinc-500">
                Please upload a screenshot of the transfer (Pix/Bank) to{" "}
                <strong>payments@cselol.com</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500 justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>
                Captain Verified: {myTeam.created_by_user_id ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRegisterOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={processRegistration}
              disabled={isRegistering || !proofPath || isUploadingProof}
              className="bg-primary text-primary-foreground font-bold"
            >
              {isRegistering ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Confirm & Register"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
