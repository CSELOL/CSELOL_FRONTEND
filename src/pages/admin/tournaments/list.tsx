import { useState, useEffect } from "react";
import { Calendar, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type Tournament,
  TournamentService,
} from "@/services/tournament-service";
import { TeamService } from "@/services/team-service";

export function AdminTournamentsList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<
    "check" | "success" | "error"
  >("check");

  // State for user's team (fetched from service)
  const [myTeam, setMyTeam] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournamentsData, teamData] = await Promise.all([
          TournamentService.getAll(),
          TeamService.getMyTeam(),
        ]);
        setTournaments(tournamentsData);
        setMyTeam(teamData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegisterClick = (t: Tournament) => {
    setSelectedTournament(t);
    setRegistrationStep("check");
    setIsRegisterOpen(true);
  };

  const processRegistration = async () => {
    if (!myTeam) return;

    // Rule: Team must have at least 5 members
    if (myTeam.members.length >= 5) {
      try {
        await TournamentService.registerTeam(selectedTournament!.id, myTeam.id);
        setRegistrationStep("success");
      } catch (e) {
        setRegistrationStep("error");
      }
    } else {
      setRegistrationStep("error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Tournament Management
          </h1>
          <p className="text-zinc-400">
            Manage official leagues and community cups.
          </p>
        </div>
        <Button>Create Tournament</Button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <Card
            key={t.id}
            className="bg-zinc-900/50 border-white/10 overflow-hidden flex flex-col hover:border-white/20 transition-all group"
          >
            {/* Image Cover */}
            <div className="h-48 w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${t.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              <Badge
                className={`absolute top-4 right-4 ${
                  t.status === "OPEN"
                    ? "bg-emerald-500 text-white"
                    : t.status === "FULL"
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              >
                {t.status}
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-white text-xl">{t.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-3 w-3" /> {t.date}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Prize Pool</span>
                <span className="font-bold text-white font-mono">
                  {t.prize}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Registered</span>
                <span className="font-bold text-zinc-300">{t.slots}</span>
              </div>
            </CardContent>

            <CardFooter className="pt-0 gap-2">
              <Button
                variant="outline"
                className="w-full border-white/10 text-zinc-300"
                onClick={() => handleRegisterClick(t)}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                className="w-full bg-zinc-800 text-white"
              >
                Manage
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* --- REGISTRATION VALIDATION MODAL (For Admin Testing) --- */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Register for {selectedTournament?.name}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Validating team eligibility...
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {registrationStep === "check" && myTeam && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                  <span className="text-sm text-zinc-400">Team Name</span>
                  <span className="font-bold">{myTeam.name}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                  <span className="text-sm text-zinc-400">Roster Count</span>
                  <span
                    className={`font-bold ${
                      myTeam.members.length >= 5
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {myTeam.members.length} / 5 Required
                  </span>
                </div>
                <div className="text-xs text-zinc-500 mt-2">
                  * According to rule 1.3, teams must have at least 5 active
                  members to register.
                </div>
              </div>
            )}

            {registrationStep === "error" && (
              <div className="text-center py-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-3">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Registration Failed
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Your team needs at least 5 members to join this tournament.
                  Please invite more players.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsRegisterOpen(false)}
                >
                  Close
                </Button>
              </div>
            )}

            {registrationStep === "success" && (
              <div className="text-center py-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Registration Successful!
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  {myTeam?.name} is now registered for{" "}
                  {selectedTournament?.name}.
                </p>
                <Button
                  className="bg-primary text-primary-foreground"
                  onClick={() => setIsRegisterOpen(false)}
                >
                  Done
                </Button>
              </div>
            )}
          </div>

          {registrationStep === "check" && (
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsRegisterOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={processRegistration}
                className="bg-primary text-primary-foreground"
              >
                Confirm Registration
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
