// src/components/layout/navbar.tsx
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { publicNavItems } from "./nav-config";
import { useAuth } from "@/providers/auth-provider";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  // Import register along with login/logout
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

        {/* --- 2. Navigation --- */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* --- 3. Action Buttons (Right) --- */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            // LOGGED IN
            <>
              <span className="text-sm text-muted-foreground hidden lg:inline-block">
                {user?.firstName || user?.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-[0_0_10px_rgba(50,255,150,0.2)]"
                asChild
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            // GUEST (Direct Keycloak Actions)
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => login()} // <--- Direct Login
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Sign in
              </Button>

              <Button
                size="sm"
                onClick={() => register()} // <--- Direct Register
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-[0_0_10px_rgba(50,255,150,0.2)] cursor-pointer"
              >
                Start your journey
              </Button>
            </>
          )}
        </div>

        {/* --- Mobile Menu --- */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l-white/5 bg-background text-foreground"
            >
              <SheetHeader className="text-left border-b border-white/5 pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Zap className="h-4 w-4 fill-current" />
                  </div>
                  CSELOL
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-2">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-md px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}

                <div className="h-px bg-white/5 my-2" />

                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Signed in as {user?.firstName || user?.username}
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start text-red-400 hover:text-red-300"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                    <Button
                      className="w-full bg-primary text-primary-foreground"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        login(); // Direct Login
                        setIsOpen(false);
                      }}
                    >
                      Sign in
                    </Button>
                    <Button
                      className="w-full bg-primary text-primary-foreground"
                      onClick={() => {
                        register(); // Direct Register
                        setIsOpen(false);
                      }}
                    >
                      Start your journey
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
