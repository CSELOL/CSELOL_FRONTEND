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
import { StandingsPage } from "./pages/standings-page";
import { TeamProfilePage } from "./pages/public/team-profile-page";
import { PublicTournamentsPage } from "./pages/public/tournaments-page";
import { SponsorsPage } from "./pages/public/sponsors-page";

// Dashboard Components
import { DashboardLayout } from "./components/layout/dashboard-layout";
import { DashboardPage } from "./pages/dashboard/overview";
import { MyTeamPage } from "./pages/dashboard/my-team";
import { PlayerMatchesPage } from "./pages/dashboard/matches";
import { SettingsPage } from "./pages/dashboard/settings";
import { TournamentsHubPage } from "./pages/dashboard/tournaments-hub";
import { DashboardTournamentDetailPage } from "./pages/dashboard/tournament-detail";

// Admin Components
import { AdminOverviewPage } from "./pages/dashboard/admin/overview";
import { AdminTournamentsPage } from "./pages/dashboard/admin/manage-tournaments";
import { AdminTournamentDetailPage } from "./pages/dashboard/admin/manage-tournaments-detail";
import { UserManagementPage } from "./pages/dashboard/admin/user-management";
import { SystemSettingsPage } from "./pages/dashboard/admin/system-settings";
import { ActivityLogsPage } from "./pages/dashboard/admin/activity-logs";

// Public Components
import { HistoryPage } from "./pages/public/history-page";
import { TeamsListPage } from "./pages/public/teams-list-page";
import { SponsorsSection } from "./components/landing/sponsors-section";
import { ContactPage } from "./pages/public/contact-page";
import { CommunitySection } from "./components/landing/community-section";
import { HistoryTeaser } from "./components/landing/history-teaser";

// Auth Protection
import { ProtectedRoute } from "./components/auth/protected-route";
import { Toaster } from "./components/ui/sonner";
import { PublicTournamentDetailPage } from "./pages/public/tournamenta-detail-page";

// Helper Layout
const PublicLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
      {/* Toaster removed from here */}
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
            {/* --- PUBLIC ROUTES --- */}
            <Route element={<PublicLayout />}>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <MatchesSection />
                    <CommunitySection />
                    <HistoryTeaser />
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
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/tournaments/:id"
                element={<PublicTournamentDetailPage />}
              />
            </Route>

            {/* --- DASHBOARD ROUTES --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="team" element={<MyTeamPage />} />
                <Route
                  path="tournaments"
                  element={<TournamentsHubPage />}
                />
                <Route
                  path="tournaments/:id"
                  element={<DashboardTournamentDetailPage />}
                />
                <Route path="matches" element={<PlayerMatchesPage />} />
                <Route path="settings" element={<SettingsPage />} />

                <Route path="admin" element={<ProtectedRoute role="admin" />}>
                  <Route index element={<AdminOverviewPage />} />
                  <Route
                    path="tournaments"
                    element={<AdminTournamentsPage />}
                  />
                  <Route
                    path="tournaments/:id"
                    element={<AdminTournamentDetailPage />}
                  />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="logs" element={<ActivityLogsPage />} />
                  <Route path="settings" element={<SystemSettingsPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
