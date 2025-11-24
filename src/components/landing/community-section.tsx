import { MessageSquare, Twitter, Instagram, Twitch, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CommunitySection() {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      
      {/* Background with Discord Blur */}
      <div className="absolute inset-0 bg-[#5865F2]/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5865F2]/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: The Pitch */}
            <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-3 py-1 text-sm font-medium text-[#5865F2]">
                    <span className="flex h-2 w-2 rounded-full bg-[#5865F2] mr-2 animate-pulse"></span>
                    Community Hub
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                    Don't Miss a Single <br />
                    <span className="text-[#5865F2]">Gank or Play.</span>
                </h2>
                
                <p className="text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0">
                    The tournament doesn't end when the nexus explodes. Join the largest League of Legends community in Sergipe. Find scrims, get live bracket updates, and trash talk (respectfully).
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button 
                        size="lg" 
                        className="h-14 px-8 text-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold shadow-[0_0_30px_-5px_rgba(88,101,242,0.4)]"
                        onClick={() => window.open("https://discord.gg/YOUR_LINK", "_blank")}
                    >
                        <MessageSquare className="mr-2 h-6 w-6" />
                        Join the Discord
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline" 
                        className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 text-zinc-300"
                    >
                        View Socials
                    </Button>
                </div>
            </div>

            {/* Right: Social Grid */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#1DA1F2]/10 border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 transition-colors cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <Twitter className="h-8 w-8 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="font-bold text-white">Twitter / X</div>
                            <div className="text-xs text-[#1DA1F2]">@cselol_oficial</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#E1306C]/10 border-[#E1306C]/20 hover:bg-[#E1306C]/20 transition-colors cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <Instagram className="h-8 w-8 text-[#E1306C] group-hover:scale-110 transition-transform" />
                        <div>
                            <div className="font-bold text-white">Instagram</div>
                            <div className="text-xs text-[#E1306C]">Bastidores e Highlights</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#9146FF]/10 border-[#9146FF]/20 hover:bg-[#9146FF]/20 transition-colors cursor-pointer group col-span-2">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-[#9146FF] flex items-center justify-center text-white">
                                <Twitch className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white text-lg">Twitch.tv</div>
                                <div className="text-sm text-[#9146FF]">Assista aos jogos ao vivo</div>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-zinc-500 group-hover:text-white transition-colors" />
                    </CardContent>
                </Card>
            </div>

        </div>
      </div>
    </section>
  );
}