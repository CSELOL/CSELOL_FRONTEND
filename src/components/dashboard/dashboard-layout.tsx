import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Swords, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const sidebarItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Team", href: "/dashboard/team", icon: Users },
  { title: "Matches", href: "/dashboard/matches", icon: Swords },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background pt-16">
      {/* --- Sidebar (Desktop) --- */}
      <aside className="hidden w-64 flex-col border-r border-white/5 bg-card/20 backdrop-blur-sm md:flex fixed h-[calc(100vh-4rem)] top-16">
        <div className="flex flex-col gap-2 p-4">
          <div className="mb-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Command Center
          </div>

          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-primary" : "text-zinc-500"
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-lg border border-white/5 bg-gradient-to-br from-primary/10 to-transparent p-4">
            <p className="text-xs font-medium text-white">Season 5 Status</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400">
                Registrations Open
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 md:ml-64">
        <div className="container max-w-6xl p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
