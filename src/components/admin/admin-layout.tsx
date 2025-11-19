import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Users,
  ShieldAlert,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminSidebar = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Tournaments", href: "/admin/tournaments", icon: Trophy },
  { title: "Teams & Users", href: "/admin/users", icon: Users },
  { title: "Disputes", href: "/admin/disputes", icon: ShieldAlert },
  { title: "System", href: "/admin/settings", icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-zinc-950 pt-16">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-white/5 bg-zinc-900/50 backdrop-blur-sm md:flex fixed h-[calc(100vh-4rem)] top-16">
        <div className="flex flex-col gap-2 p-4">
          <div className="mb-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-2">
            <ShieldAlert className="h-3 w-3" /> Admin Panel
          </div>

          {adminSidebar.map((item) => {
            const isActive = location.pathname === item.href;
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
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="container max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
