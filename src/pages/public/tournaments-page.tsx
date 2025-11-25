import { Calendar, ArrowRight, Lock } from "lucide-react";
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
import { Link } from "react-router-dom";

const tournaments = [
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
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="bg-zinc-900 border border-white/5">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <Card
              key={t.id}
              className="bg-zinc-900/50 border-white/10 overflow-hidden flex flex-col hover:border-white/20 transition-all group"
            >
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

              <CardFooter className="pt-0">
                {/* 
                           --- KEY CHANGE --- 
                           Instead of opening a modal, we redirect to the dashboard 
                        */}
                {t.status === "OPEN" ? (
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
                    <Lock className="mr-2 h-4 w-4" />
                    {t.status === "FULL"
                      ? "Registration Closed"
                      : "Event Ended"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
