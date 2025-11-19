import { useState } from "react";
import { Calendar, Lock, CheckCircle2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- 1. Define the Type Interface ---
interface Tournament {
  id: number;
  name: string;
  status: "OPEN" | "FULL" | "COMPLETED"; // Union type for specific status values
  date: string;
  prize: string;
  slots: string;
  minRank: string;
  img: string;
}

// Mock Data typed with the Interface
const tournaments: Tournament[] = [
  {
    id: 1,
    name: "Season 5 - Split 1",
    status: "OPEN",
    date: "May 15",
    prize: "R$ 5.000",
    slots: "8/16",
    minRank: "Open",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Community Cup #4",
    status: "FULL",
    date: "June 01",
    prize: "RP Points",
    slots: "32/32",
    minRank: "Gold+",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Season 4 Finals",
    status: "COMPLETED",
    date: "Jan 10",
    prize: "R$ 10.000",
    slots: "16/16",
    minRank: "Open",
    img: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2070&auto=format&fit=crop",
  },
];

export function PublicTournamentsPage() {
  // --- 2. Use the Type in useState ---
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<
    "check" | "success" | "error"
  >("check");

  // Mock User State
  const userState = {
    isCaptain: true,
    teamName: "Sergipe Slayers",
    memberCount: 5, // Change to 5 to test success
  };

  // --- 3. Type the function argument ---
  const handleRegisterClick = (t: Tournament) => {
    setSelectedTournament(t);
    setRegistrationStep("check");
    setIsRegisterOpen(true);
  };

  const processRegistration = () => {
    if (userState.memberCount >= 5) {
      setRegistrationStep("success");
    } else {
      setRegistrationStep("error");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Tournaments</h1>
            <p className="text-zinc-400">
              Compete in official leagues and community cups.
            </p>
          </div>
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="bg-zinc-900 border border-white/5">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            {/* Content wrappers for tabs just to show list in 'all' for now */}
            <TabsContent value="all" className="mt-0"></TabsContent>
            <TabsContent value="open" className="mt-0"></TabsContent>
            <TabsContent value="past" className="mt-0"></TabsContent>
          </Tabs>
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Rank Req.</span>
                  <span className="font-bold text-zinc-300">{t.minRank}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                {t.status === "OPEN" ? (
                  <Button
                    onClick={() => handleRegisterClick(t)}
                    className="w-full bg-primary text-primary-foreground font-bold"
                  >
                    Register Team
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-zinc-500"
                    disabled
                  >
                    {t.status === "FULL"
                      ? "Registration Closed"
                      : "View Results"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* --- REGISTRATION VALIDATION MODAL --- */}
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Register for {selectedTournament?.name}</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Validating team eligibility...
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              {registrationStep === "check" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                    <span className="text-sm text-zinc-400">Team Name</span>
                    <span className="font-bold">{userState.teamName}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                    <span className="text-sm text-zinc-400">Roster Count</span>
                    <span
                      className={`font-bold ${
                        userState.memberCount >= 5
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {userState.memberCount} / 5 Required
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
                    {userState.teamName} is now registered for{" "}
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
                <Button
                  variant="ghost"
                  onClick={() => setIsRegisterOpen(false)}
                >
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
    </div>
  );
}
