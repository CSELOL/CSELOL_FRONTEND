import { Link } from "react-router-dom";
import { ArrowRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HistoryTeaser() {
  return (
    <section className="relative w-full py-32 overflow-hidden bg-black border-t border-white/5 ">
      {/* Background Image with Heavy Fade */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 grayscale"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-zinc-500 mb-6 uppercase tracking-widest text-xs font-bold">
            <History className="h-4 w-4" />
            <span>Our Legacy</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            From Local LANs to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">
              The Big Stage.
            </span>
          </h2>

          <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
            CSELOL wasn't built in a day. Discover the origins of the circuit,
            the champions of past seasons, and how we grew into Sergipe's
            premier esports organization.
          </p>

          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-zinc-200 font-bold h-14 px-8 text-lg"
          >
            <Link to="/history">
              Explore Our History <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
