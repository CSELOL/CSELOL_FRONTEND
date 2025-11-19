import { Link } from "react-router-dom";
import { Zap, Twitter, Twitch, Youtube, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-12">
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                CSELOL
              </span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs">
              The premier League of Legends competitive circuit in Sergipe.
              Professional tournaments, community events, and scouting grounds.
            </p>
            <div className="flex gap-4 text-zinc-500">
              <Twitter className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
              <Twitch className="h-5 w-5 hover:text-purple-500 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 hover:text-red-500 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-pink-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Tournament
            </h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <Link
                  to="/standings"
                  className="hover:text-primary transition-colors"
                >
                  Standings
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  to="/rules"
                  className="hover:text-primary transition-colors"
                >
                  Rulebook
                </Link>
              </li>
              <li>
                <Link
                  to="/teams"
                  className="hover:text-primary transition-colors"
                >
                  Teams
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Report a Player
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Apply for Staff
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Sponsorships
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Cookie Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-zinc-600">
          <p>
            &copy; {new Date().getFullYear()} CSELOL Circuit. Not affiliated
            with Riot Games.
          </p>
        </div>
      </div>
    </footer>
  );
}
