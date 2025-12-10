import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Swords,
  Settings,
  Trophy,
  LogOut,
  ShieldAlert,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

// 1. Standard Player Links
const playerItems = [
  { title: "Visão Geral", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Meu Time", href: "/dashboard/team", icon: Users },
  { title: "Torneios", href: "/dashboard/tournaments", icon: Trophy },
  { title: "Minhas Partidas", href: "/dashboard/matches", icon: Swords },
  { title: "Configurações", href: "/dashboard/settings", icon: Settings },
];

// 2. Admin Links
const adminItems = [
  {
    title: "Visão Geral Admin",
    href: "/dashboard/admin",
    icon: ShieldAlert,
    exact: true,
  },
  {
    title: "Gerenciar Torneios",
    href: "/dashboard/admin/tournaments",
    icon: Trophy,
  },
  { title: "Gerenciar Usuários", href: "/dashboard/admin/users", icon: Users },
  {
    title: "Configurações do Sistema",
    href: "/dashboard/admin/settings",
    icon: Sliders,
  },
];

export function DashboardLayout() {
  const location = useLocation();
  const { logout, hasRole } = useAuth(); // Import hasRole

  // 3. Check Permissions
  const isAdmin = hasRole("admin");

  return (
    <div className="flex min-h-screen bg-background pt-16">
      {/* --- Sidebar (Desktop) --- */}
      <aside className="hidden w-64 flex-col border-r border-white/5 bg-card/20 backdrop-blur-sm md:flex fixed h-[calc(100vh-4rem)] top-16 overflow-y-auto">
        {/* PLAYER ZONE */}
        <div className="flex flex-col gap-2 p-4">
          <div className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Área do Jogador
          </div>

          {playerItems.map((item) => {
            // Logic to highlight active link
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);

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

        {/* ADMIN ZONE (Conditionally Rendered) */}
        {isAdmin && (
          <div className="flex flex-col gap-2 p-4 pt-0">
            <div className="my-2 px-4 text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-2">
              Painel Admin
            </div>

            {adminItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-red-500/10 text-red-500"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-red-500" : "text-zinc-500"
                    )}
                  />
                  {item.title}
                </Link>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto p-4 border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/5"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 md:ml-64">
        <div className="container max-w-7xl p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
