import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const LOGO_DEV_PUBLIC_KEY = "pk_ELb3Q3krRkuKdF_Spe59lQ";

const sponsors = [
  { name: "Logitech G", domain: "logitechg.com", tier: "Peripheral Partner" },
  { name: "Red Bull", domain: "redbull.com", tier: "Official Energy" },
  { name: "Alienware", domain: "alienware.com", tier: "Hardware Partner" },
  { name: "HyperX", domain: "hyperx.com", tier: "Audio Partner" },
  { name: "Secretlab", domain: "secretlab.co", tier: "Chair Partner" },
  { name: "Discord", domain: "discord.com", tier: "Community Partner" },
  {
    name: "Monster Energy",
    domain: "monsterenergy.com",
    tier: "Beverage Partner",
  },
  { name: "Twitch", domain: "twitch.tv", tier: "Broadcast Partner" },
];

export function SponsorsSection() {
  return (
    <section className="w-full bg-background border-y border-white/5 py-24 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container px-4 md:px-6 mb-12 text-center relative z-10 mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase">
          Official Partners
        </h2>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
          The CSELOL Circuit is powered by industry leaders supporting the
          growth of esports in Sergipe.
        </p>
      </div>

      {/* --- INFINITE MARQUEE CAROUSEL --- */}
      <div className="relative w-full flex overflow-hidden mask-gradient-x">
        <style>{`
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .animate-infinite-scroll {
                animation: scroll 40s linear infinite;
            }
            .animate-infinite-scroll:hover {
                animation-play-state: paused;
            }
         `}</style>

        <div className="flex animate-infinite-scroll gap-6 px-6 w-max">
          {[...sponsors, ...sponsors].map((sponsor, index) => (
            <Link to="/sponsors" key={index}>
              <Card className="w-[280px] h-[160px] bg-zinc-900/40 border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/5 hover:border-primary/30 transition-all duration-300 group cursor-pointer backdrop-blur-sm">
                <CardContent className="p-0 flex flex-col items-center w-full">
                  <div className="h-16 w-16 mb-3 relative flex items-center justify-center">
                    <img
                      src={`https://img.logo.dev/${sponsor.domain}?token=${LOGO_DEV_PUBLIC_KEY}`}
                      alt={sponsor.name}
                      className="object-contain h-full w-full rounded-lg  group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                    {/* Fallback Text */}
                    <span className="hidden text-xl font-bold text-zinc-500 group-hover:text-white">
                      {sponsor.name[0]}
                    </span>
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {sponsor.name}
                    </h3>
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                      {sponsor.tier}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
