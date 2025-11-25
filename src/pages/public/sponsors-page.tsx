import { Zap, Star, Heart, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SponsorsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container max-w-6xl px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
            Our Partners
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            The CSELOL Circuit is made possible by the support of these
            visionary organizations who believe in the future of Sergipe
            esports.
          </p>
        </div>

        {/* --- TIER 1: TITLE SPONSORS (Huge) --- */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Title Sponsors
            </span>
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="bg-zinc-900/50 border-primary/20 h-64 flex items-center justify-center group hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <div className="text-3xl font-black text-zinc-600 group-hover:text-white transition-colors">
                  LOGO PLACEHOLDER
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* --- TIER 2: GOLD PARTNERS (Large) --- */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-500">
              Gold Partners
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-zinc-900/50 border-white/5 h-48 flex items-center justify-center group hover:border-yellow-500/30 transition-colors cursor-pointer"
              >
                <div className="text-xl font-bold text-zinc-700 group-hover:text-zinc-300 transition-colors">
                  PARTNER LOGO
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* --- TIER 3: SUPPORTERS (Grid) --- */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              Community Supporters
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card
                key={i}
                className="bg-zinc-900/30 border-white/5 h-32 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer"
              >
                <div className="text-sm font-bold text-zinc-800 hover:text-zinc-500">
                  LOGO
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-900 to-black p-12 text-center">
          <Shield className="h-12 w-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Become a Partner
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Connect your brand with thousands of passionate gamers. We offer
            custom activations, broadcast slots, and event presence.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-zinc-200 font-bold"
          >
            Download Media Kit
          </Button>
        </div>
      </div>
    </div>
  );
}
