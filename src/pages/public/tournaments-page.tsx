import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Lock, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTournamentsAPI } from "@/api/tournaments"; // Import API

// Define Interface matching your API
interface Tournament {
  id: number;
  tournament_name: string;
  status: string; // scheduled, running, completed
  start_date: string | null;
  banner_url: string | null;
  // ... other fields
  is_listed: boolean;
  allow_signups: boolean;
}

export function PublicTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTournamentsAPI();
        // Filter: Only show tournaments where is_listed = true
        const publicTournaments = data.filter((t: Tournament) => t.is_listed);
        setTournaments(publicTournaments);
      } catch (error) {
        console.error("Failed to load tournaments", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading)
    return (
      <div className="pt-32 text-center text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" /> Loading Events...
      </div>
    );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container max-w-6xl px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Tournaments</h1>
            <p className="text-zinc-400">
              Compete in official leagues and community cups.
            </p>
          </div>
          {/* Tabs can remain static or filter the 'tournaments' state */}
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="bg-zinc-900 border border-white/5">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <Card
              key={t.id}
              className="bg-zinc-900/50 border-white/10 overflow-hidden flex flex-col hover:border-white/20 transition-all group"
            >
              <div className="h-48 w-full relative overflow-hidden bg-black">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: t.banner_url
                      ? `url(${t.banner_url})`
                      : undefined,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <Badge className="absolute top-4 right-4 bg-zinc-800 text-white border-0 capitalize">
                  {t.status}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-white text-xl">
                  {t.tournament_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {t.start_date
                    ? new Date(t.start_date).toLocaleDateString()
                    : "TBD"}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-0 mt-auto">
                {t.allow_signups ? (
                  <Button
                    className="w-full bg-primary text-primary-foreground font-bold"
                    asChild
                  >
                    <Link to="/dashboard/tournaments">
                      Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-zinc-500"
                    disabled
                  >
                    <Lock className="mr-2 h-4 w-4" /> Registration Closed
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}

          {tournaments.length === 0 && (
            <div className="col-span-full text-center py-20 text-zinc-500">
              No active tournaments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
