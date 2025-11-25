import { Calendar, Trophy, Star, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Mock Data for the Timeline
const historyEvents = [
  {
    year: "2021",
    title: "A Incepção",
    description:
      "Tudo começou em uma pequena lan house no centro de Aracaju. Um grupo de amigos decidiu organizar um campeonato amador para testar quem era o melhor da região. O que era para ser uma tarde de diversão acabou atraindo a atenção de 10 times locais e mais de 100 espectadores online.",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
    icon: Star,
    stats: "10 Times • 100 Viewers",
  },
  {
    year: "2022",
    title: "CSELOL Season 1",
    description:
      "Com o sucesso do piloto, a Season 1 foi lançada oficialmente. Estabelecemos as primeiras regras oficiais, criamos a identidade visual e fechamos a primeira parceria local. Foi o ano em que o cenário competitivo de Sergipe começou a ganhar forma e profissionalismo.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    icon: Trophy,
    stats: "R$ 1.000 Prize Pool",
  },
  {
    year: "2023",
    title: "A Expansão Regional",
    description:
      "O torneio cresceu além das fronteiras da capital. Times de Lagarto, Itabaiana e Estância se juntaram à disputa. A grande final foi transmitida em um estúdio profissional, alcançando recordes de audiência na Twitch e solidificando a marca CSELOL.",
    image:
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2070&auto=format&fit=crop",
    icon: MapPin,
    stats: "32 Times • 4 Cidades",
  },
  {
    year: "2024",
    title: "Season 4: A Era de Ouro",
    description:
      "A introdução do sistema de Divisões e a parceria com marcas nacionais elevaram o nível. A premiação atingiu valores históricos e os jogadores começaram a ser scoutados por times do Tier 3 nacional. O CSELOL deixou de ser apenas um torneio e virou uma vitrine de talentos.",
    image:
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop",
    icon: Users,
    stats: "R$ 5.000 Prize Pool",
  },
  {
    year: "2025",
    title: "O Futuro é Agora",
    description:
      "Com a nova plataforma web integrada, sistema de matchmaking e autenticação via Riot ID, estamos prontos para a maior temporada de todas. O objetivo agora é claro: tornar Sergipe a maior potência de League of Legends do Nordeste.",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c29736ce37?q=80&w=2070&auto=format&fit=crop",
    icon: Star,
    stats: "Plataforma Própria",
  },
];

export function HistoryPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20 ">
      {/* Header */}
      <div className="container max-w-4xl px-4 text-center mb-20 mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-6">
          Nossa História
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          De torneios em lan houses a arenas lotadas. Conheça a trajetória que
          transformou o cenário competitivo de Sergipe.
        </p>
      </div>

      <div className="container max-w-6xl px-4 relative mx-auto">
        {/* Central Line (Desktop Only) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2" />

        <div className="space-y-12 md:space-y-24">
          {historyEvents.map((event, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={event.year}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Center Point (Timeline Dot) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border-4 border-background shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                </div>

                {/* Content Side (Text) */}
                <div
                  className={`w-full md:w-1/2 ${
                    isEven ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <div className="flex flex-col gap-4 items-center md:items-stretch">
                    {/* Year Badge */}
                    <div
                      className={`flex ${
                        isEven ? "md:justify-end" : "md:justify-start"
                      }`}
                    >
                      <Badge
                        variant="outline"
                        className="border-primary/50 text-primary bg-primary/10 px-4 py-1 text-lg font-bold"
                      >
                        {event.year}
                      </Badge>
                    </div>

                    <h2 className="text-3xl font-bold text-white">
                      {event.title}
                    </h2>
                    <p className="text-zinc-400 leading-relaxed max-w-md mx-auto md:mx-0">
                      {event.description}
                    </p>

                    {/* Stats / Icon */}
                    <div
                      className={`flex items-center gap-2 text-sm font-bold text-zinc-500 mt-2 ${
                        isEven ? "md:justify-end" : "md:justify-start"
                      }`}
                    >
                      <event.icon className="h-4 w-4" />
                      <span>{event.stats}</span>
                    </div>
                  </div>
                </div>

                {/* Image Side (Card) */}
                <div className="w-full md:w-1/2">
                  <Card className="overflow-hidden border-white/10 bg-zinc-900/50 group hover:border-primary/50 transition-colors duration-500">
                    <CardContent className="p-0">
                      <div className="relative h-64 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
