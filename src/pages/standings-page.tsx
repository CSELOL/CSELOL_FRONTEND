// src/pages/standings-page.tsx
import * as React from "react";
import { ChevronDown, Trophy, History, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bracket } from "@/components/tournament/bracket";
import { GroupStage } from "@/components/tournament/group-stage";

export function StandingsPage() {
  // Logic to handle current tournament
  const [tournament, setTournament] = React.useState("season-5");

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* --- 1. Tournament Header (Selector) --- */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: Title & Selector */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Tournament Center
                </h1>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
                  Official Standings
                </p>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-white/10 md:block mx-4" />

            {/* THE SELECTOR: Makes it obvious which event is showing */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500">
                Current Event
              </label>
              <Select value={tournament} onValueChange={setTournament}>
                <SelectTrigger className="w-[280px] border-white/10 bg-white/5 text-white font-medium h-10 focus:ring-primary/50">
                  <SelectValue placeholder="Select Tournament" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-zinc-300">
                  <SelectItem
                    value="season-5"
                    className="focus:bg-white/10 focus:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Season 5 - Split 1 (Live)
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="community-cup"
                    className="focus:bg-white/10 focus:text-white"
                  >
                    Community Cup #2
                  </SelectItem>
                  <SelectItem
                    value="season-4"
                    className="focus:bg-white/10 focus:text-white"
                  >
                    <span className="flex items-center gap-2 text-zinc-500">
                      <History className="h-3 w-3" /> Season 4 (Archived)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right: Tournament Info */}
          <div className="flex gap-4">
            <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-center">
              <span className="block text-[10px] uppercase text-zinc-500 font-bold">
                Prize Pool
              </span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                R$ 10.000
              </span>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-center">
              <span className="block text-[10px] uppercase text-zinc-500 font-bold">
                Teams
              </span>
              <span className="font-mono text-sm font-bold text-white">
                8 / 32
              </span>
            </div>
          </div>
        </div>

        {/* --- 2. Tabs (Switch between Regular & Playoffs) --- */}
        <Tabs defaultValue="group-stage" className="w-full">
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-1">
            <TabsList className="bg-transparent p-0 gap-6">
              <TabsTrigger
                value="group-stage"
                className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-bold uppercase tracking-wide text-zinc-500 data-[state=active]:border-primary data-[state=active]:text-white data-[state=active]:shadow-none transition-all hover:text-zinc-300"
              >
                Regular Season
              </TabsTrigger>
              <TabsTrigger
                value="playoffs"
                className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-bold uppercase tracking-wide text-zinc-500 data-[state=active]:border-primary data-[state=active]:text-white data-[state=active]:shadow-none transition-all hover:text-zinc-300"
              >
                Playoffs Bracket
              </TabsTrigger>
            </TabsList>

            {/* Extra filters could go here */}
            <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500">
              <Calendar className="h-3 w-3" /> Last updated: 10 mins ago
            </div>
          </div>

          {/* --- CONTENT --- */}
          <TabsContent
            value="group-stage"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="mb-4 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/20 text-primary bg-primary/5"
              >
                Phase 1
              </Badge>
              <span className="text-sm text-zinc-400">
                Round Robin - Top 4 advance to playoffs
              </span>
            </div>
            <GroupStage />
          </TabsContent>

          <TabsContent
            value="playoffs"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="mb-4 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-purple-500/20 text-purple-400 bg-purple-500/5"
              >
                Phase 2
              </Badge>
              <span className="text-sm text-zinc-400">
                Single Elimination - Best of 3
              </span>
            </div>
            {/* We wrap the Bracket in a border/bg container to match the Group Stage look */}
            <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-sm overflow-hidden min-h-[600px]">
              <Bracket />
              {/* Note: You might want to remove the 'py-20' and container from the Bracket component itself 
                     so it fits nicer inside this tab, or just keep it as is. */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
