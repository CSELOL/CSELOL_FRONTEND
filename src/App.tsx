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
// import { FeaturedTeams } from "./components/landing/featured-teams";
import { StandingsPage } from "./pages/standings-page";
import { TeamProfilePage } from "./pages/public/team-profile-page";
import { PublicTournamentsPage } from "./pages/public/tournaments-page";
import { SponsorsPage } from "./pages/public/sponsors-page";

// Dashboard Components
import { DashboardLayout } from "./components/dashboard/dashboard-layout";
import { DashboardPage } from "./pages/dashboard/overview";
import { MyTeamPage } from "./pages/dashboard/my-team";
import { PlayerMatchesPage } from "./pages/dashboard/matches";
import { SettingsPage } from "./pages/dashboard/settings";

// Admin Components
import { AdminTournamentDetailPage } from "./pages/admin/tournaments/detail";
import { AdminOverviewPage } from "./pages/admin/overview";
import { AdminTournamentsList } from "./pages/admin/tournaments/list";
import { HistoryPage } from "./pages/public/history-page";
import { TeamsListPage } from "./pages/public/teams-list-page";
import { SponsorsSection } from "./components/landing/sponsors-section";
import { ContactPage } from "./pages/public/contact-page";
import { CommunitySection } from "./components/landing/community-section";
import { HistoryTeaser } from "./components/landing/history-teaser";

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
                    <CommunitySection/>
                    <HistoryTeaser/>
                    <SponsorsSection />
                  </>
                }
              />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/tournaments" element={<PublicTournamentsPage />} />
              <Route path="/standings" element={<StandingsPage />} />
              <Route path="/teams" element={<TeamsListPage />} />
              <Route path="/teams/:teamId" element={<TeamProfilePage />} />
              <Route path="/sponsors" element={<SponsorsPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* --- GROUP 2: DASHBOARD --- */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              {/* Player Routes */}
              <Route index element={<DashboardPage />} />
              <Route path="team" element={<MyTeamPage />} />
              <Route path="matches" element={<PlayerMatchesPage />} />
              <Route path="settings" element={<SettingsPage />} />

              {/* Admin Routes (Nested under /dashboard/admin) */}
              <Route path="admin">
                <Route index element={<AdminOverviewPage />} />
                <Route path="tournaments" element={<AdminTournamentsList />} />
                <Route
                  path="tournaments/:id"
                  element={<AdminTournamentDetailPage />}
                />
                <Route
                  path="users"
                  element={
                    <h1 className="text-white">
                      User Management (Coming Soon)
                    </h1>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <h1 className="text-white">
                      System Settings (Coming Soon)
                    </h1>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
