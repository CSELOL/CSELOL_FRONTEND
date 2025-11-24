import { useEffect, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type Tournament,
  TournamentService,
} from "@/services/tournament-service";

export function PublicTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await TournamentService.getAll();
        setTournaments(data);
      } catch (error) {
        console.error("Failed to fetch tournaments", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <Button
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                  variant="secondary"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
