import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Zap, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

export function Navbar({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated, user, login, register, logout } = useAuth();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        {/* --- 1. Logo --- */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            CSELOL
          </span>
        </Link>

        {/* --- 2. Navigation (Desktop) --- */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Simple Links */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/">Início</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/history">História</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* DROPDOWN MENU: COMPETIÇÃO */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Competição
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-zinc-950 border border-white/10">
                    {/* Featured Item inside Dropdown */}
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-zinc-800/50 to-zinc-900 p-6 no-underline outline-none focus:shadow-md"
                          to="/tournaments"
                        >
                          <Zap className="h-6 w-6 text-primary mb-4" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Torneios Ativos
                          </div>
                          <p className="text-sm leading-tight text-zinc-400">
                            Inscreva-se na Season 5 e participe do circuito
                            oficial.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/standings"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 hover:text-primary focus:bg-white/5 focus:text-primary"
                        >
                          <div className="text-sm font-medium text-white leading-none">
                            Tabela
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-zinc-500">
                            Rankings e pontuações.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/teams"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 hover:text-primary focus:bg-white/5 focus:text-primary"
                        >
                          <div className="text-sm font-medium text-white leading-none">
                            Times
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-zinc-500">
                            Organizações registradas.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/rules"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 hover:text-primary focus:bg-white/5 focus:text-primary"
                        >
                          <div className="text-sm font-medium text-white leading-none">
                            Regulamento
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-zinc-500">
                            Regras e diretrizes.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/sponsors">Parceiros</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/contact">Contato</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* --- 3. Action Buttons (Right) --- */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground hidden lg:inline-block">
                {user?.firstName || user?.username}
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Logout
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => login()}>
                Sign in
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => register()}
              >
                Start Journey
              </Button>
            </>
          )}
        </div>

        {/* --- Mobile Menu --- */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l-white/5 bg-background text-foreground"
            >
              <SheetHeader className="text-left border-b border-white/5 pb-4">
                <SheetTitle className="text-white">CSELOL</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  Início
                </Link>
                <Link to="/history" onClick={() => setIsOpen(false)}>
                  História
                </Link>

                {/* Mobile Grouping */}
                <div className="flex flex-col gap-3 pl-4 border-l border-white/10">
                  <span className="text-xs font-bold text-zinc-500 uppercase">
                    Competição
                  </span>
                  <Link to="/tournaments" onClick={() => setIsOpen(false)}>
                    Torneios
                  </Link>
                  <Link to="/standings" onClick={() => setIsOpen(false)}>
                    Tabela
                  </Link>
                  <Link to="/teams" onClick={() => setIsOpen(false)}>
                    Times
                  </Link>
                  <Link to="/rules" onClick={() => setIsOpen(false)}>
                    Regulamento
                  </Link>
                </div>

                <Link to="/sponsors" onClick={() => setIsOpen(false)}>
                  Parceiros
                </Link>
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Contato
                </Link>

                <div className="h-px bg-white/5 my-2" />
                {isAuthenticated ? (
                  <Button
                    className="w-full bg-primary"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-primary"
                    onClick={() => {
                      register();
                      setIsOpen(false);
                    }}
                  >
                    Start Journey
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
