// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { Hero } from "./components/landing/hero";
import { MatchesSection } from "./components/landing/matches-section";
import { FeaturedTeams } from "./components/landing/featured-teams";
import { StandingsPage } from "./pages/standings-page";
import { TeamProfilePage } from "./pages/public/team-profile-page";

// Dashboard Components
import { DashboardLayout } from "./components/dashboard/dashboard-layout";
import { DashboardPage } from "./components/dashboard/dashboard-page";
import { MyTeamPage } from "./components/dashboard/my-team-page";
import { PlayerMatchesPage } from "./components/dashboard/player-matches-page";
import { SettingsPage } from "./components/dashboard/settings-page"; // New Import

// Admin Components
import { AdminLayout } from "./components/admin/admin-layout";
import { AdminTournamentDetailPage } from "./components/admin/tournament-detail-page";
import { AdminOverviewPage } from "./components/admin/admin-overview";
import { PublicTournamentsPage } from "./components/admin/tournaments-page";

// Helper Layout
const PublicLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* --- GROUP 1: PUBLIC PAGES --- */}
            <Route element={<PublicLayout />}>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <MatchesSection />
                    <FeaturedTeams />
                  </>
                }
              />
              <Route path="/standings" element={<StandingsPage />} />
              <Route path="/teams/:teamId" element={<TeamProfilePage />} />
            </Route>

            {/* --- GROUP 2: DASHBOARD --- */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="team" element={<MyTeamPage />} />
              <Route path="matches" element={<PlayerMatchesPage />} />

              {/* Replaced Placeholder with Settings Page */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* --- GROUP 3: ADMIN --- */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="tournaments" element={<PublicTournamentsPage />} />
              <Route
                path="tournaments/:id"
                element={<AdminTournamentDetailPage />}
              />
              <Route
                path="users"
                element={
                  <h1 className="text-white">User Management (Coming Soon)</h1>
                }
              />
              <Route
                path="settings"
                element={
                  <h1 className="text-white">System Settings (Coming Soon)</h1>
                }
              />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
