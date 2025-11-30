import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTournamentsAPI } from "@/api/tournaments";

// Helper Interface
interface Tournament {
  id: number;
  tournament_name: string;
  status: string;
  start_date: string;
  banner_url: string;
}

export function Hero() {
  const [featured, setFeatured] = useState<Tournament | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await getTournamentsAPI();
        // Find first tournament that is 'open' or 'running' and NOT archived
        const active = data.find(
          (t: any) =>
            ["open", "running", "scheduled"].includes(
              t.status?.toLowerCase()
            ) && !t.is_archived
        );
        if (active) setFeatured(active);
      } catch (e) {
        console.error("Failed to load featured tournament");
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden border-b bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 transition-all duration-1000"
          style={{
            backgroundImage: featured?.banner_url
              ? `url("${featured.banner_url}")`
              : 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 text-center pt-10">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {featured
            ? featured.status === "open"
              ? "Inscrições Abertas"
              : "Torneio em Andamento"
            : "Temporada 2026"}
        </div>

        {/* Title */}
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-7xl">
          {featured ? featured.tournament_name : "Copa Sergipana de"} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-500">
            League of Legends
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-[700px] text-lg text-muted-foreground md:text-xl">
          O maior palco do cenário competitivo de Sergipe. Monte sua equipe,
          domine o Rift e lute pela glória.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-[0_0_20px_rgba(var(--primary),0.5)]"
            asChild
          >
            <Link to={featured ? `/tournaments` : `/register`}>
              {featured?.status === "open"
                ? "Inscrever meu Time"
                : "Ver Torneios"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 text-base"
            asChild
          >
            <Link to="/rules">Ler Regulamento</Link>
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-3 text-center md:text-left max-w-4xl mx-auto border-t pt-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="uppercase text-xs font-bold tracking-wider">
                Premiação
              </span>
            </div>
            <span className="text-2xl font-bold">R$ 5.000,00</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="uppercase text-xs font-bold tracking-wider">
                Início
              </span>
            </div>
            <span className="text-2xl font-bold">
              {featured?.start_date
                ? new Date(featured.start_date).toLocaleDateString()
                : "Em breve"}
            </span>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="uppercase text-xs font-bold tracking-wider">
                Status
              </span>
            </div>
            <span className="text-2xl font-bold uppercase">
              {featured?.status || "Pré-temporada"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
