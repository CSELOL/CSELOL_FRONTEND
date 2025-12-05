import {
  Users,
  Trophy,
  Activity,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Status</h1>
          <p className="text-zinc-400">Real-time platform monitoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-500">
              Services Operational
            </span>
          </div>
          <div className="text-xs text-zinc-500 font-mono">v2.4.0</div>
        </div>
      </div>

      {/* --- 1. KPI Cards --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Players
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,350</div>
            <p className="text-xs text-zinc-500">+180 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Active Teams
            </CardTitle>
            <Trophy className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">324</div>
            <p className="text-xs text-zinc-500">+12 new this week</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Matches Played
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,234</div>
            <p className="text-xs text-zinc-500">45 active now</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Prize Pool Escrow
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 15.000</div>
            <p className="text-xs text-zinc-500">Secured via Stripe</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* --- 2. Recent Activity Feed (Left) --- */}
        <Card className="col-span-4 bg-zinc-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Live Feed</CardTitle>
            <CardDescription>
              Recent actions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                {
                  user: "TitanLGT",
                  action: "created a new team",
                  target: "Lagarto Kings",
                  time: "2 min ago",
                },
                {
                  user: "FakerSE",
                  action: "reported match result",
                  target: "Victory vs AJU",
                  time: "15 min ago",
                },
                {
                  user: "System",
                  action: "generated bracket for",
                  target: "Season 5",
                  time: "1 hour ago",
                },
                {
                  user: "New User",
                  action: "registered account",
                  target: "via Supabase",
                  time: "3 hours ago",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center">
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback className="bg-zinc-800 text-xs text-zinc-400">
                      {item.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      <span className="text-primary">{item.user}</span>{" "}
                      {item.action}{" "}
                      <span className="font-bold">{item.target}</span>
                    </p>
                    <p className="text-xs text-zinc-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* --- 3. Action Required (Right) --- */}
        <Card className="col-span-3 bg-zinc-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Pending Actions</CardTitle>
            <CardDescription>Items requiring admin attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Item 1 */}
            <div className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-bold text-white">Disputed Match</p>
                  <p className="text-xs text-zinc-400">
                    SLY vs EST • Match ID #442
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 hover:bg-white/10"
              >
                Review
              </Button>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-card/50 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-bold text-white">Verify Team</p>
                  <p className="text-xs text-zinc-400">
                    "Barra Bulls" uploaded new logo
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 hover:bg-white/10"
              >
                Review
              </Button>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-card/50 p-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-zinc-500" />
                <div>
                  <p className="text-sm font-bold text-white">User Report</p>
                  <p className="text-xs text-zinc-400">
                    Player "Troll420" flagged for toxicity
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 hover:bg-white/10"
              >
                Review
              </Button>
            </div>

            <Button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700">
              View All Tasks <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
