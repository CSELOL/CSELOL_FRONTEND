import { Link } from "react-router-dom";
import {
  Trophy,
  Users,
  Activity,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center pt-20 overflow-hidden bg-background text-foreground">
      {/* --- LAYER 1: Atmospheric Background Image (The "Esports" Vibe) --- */}
      <div className="absolute inset-0 z-0">
        {/* 
           We use a dark, smoky abstract image here. 
           'mix-blend-overlay' helps it fuse with your dark theme colors.
        */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop")',
          }}
        />

        {/* Heavy gradient to darken the image so text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/80" />

        {/* Radial Gradient: "Spotlight" effect behind the text */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* --- LAYER 2: The Tech Grid (The "Supabase" Vibe) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* --- Content --- */}
      <div className="container relative z-10 flex flex-col items-center px-4 text-center md:px-6 max-w-5xl mt-10">
        {/* Season Badge */}
        <div className="group mb-6 inline-flex items-center rounded-full border border-white/10 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-zinc-900/80">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="font-medium text-zinc-200">
            Season 5 Registrations Open
          </span>
          <ChevronRight className="ml-2 h-3 w-3 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Main Title */}
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white lg:text-7xl drop-shadow-2xl">
          Dominate the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
            Summoner's Rift
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-[600px] text-lg text-zinc-400 md:text-xl leading-relaxed">
          The official CSELOL tournament platform. Join{" "}
          <span className="text-zinc-200 font-medium">50+ teams</span> competing
          for the
          <span className="text-primary font-bold"> R$ 10.000</span> prize pool.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(50,255,150,0.15)]"
            asChild
          >
            <Link to="/register">Create Team</Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white backdrop-blur-sm"
            asChild
          >
            <Link to="/schedule">View Brackets</Link>
          </Button>
        </div>

        {/* --- Glassmorphism Stats Bar (Esports HUD style) --- */}
        <div className="mt-20 grid w-full grid-cols-1 divide-y divide-white/10 border border-white/10 bg-zinc-950/40 backdrop-blur-md md:grid-cols-3 md:divide-x md:divide-y-0 rounded-2xl shadow-2xl shadow-black/50">
          {/* Stat 1 */}
          <div className="group flex flex-col items-center justify-center p-6 transition-colors hover:bg-white/5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Trophy className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-white">R$ 10k</span>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Prize Pool
            </span>
          </div>

          {/* Stat 2 */}
          <div className="group flex flex-col items-center justify-center p-6 transition-colors hover:bg-white/5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-white">32 Teams</span>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Registered
            </span>
          </div>

          {/* Stat 3 */}
          <div className="group flex flex-col items-center justify-center p-6 transition-colors hover:bg-white/5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-2xl font-bold text-white">Live</span>
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Twitch Stream
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
