// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/navbar";
import { Hero } from "./components/landing/hero";
import { MatchesSection } from "./components/landing/matches-section";
import { FeaturedTeams } from "./components/landing/featured-teams";
import { StandingsPage } from "./pages/standings-page";
import { ProtectedRoute } from "./components/auth/protected-route";

// Remove imports for LoginPage and RegisterPage

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Navbar />

        <main>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
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

            {/* --- PRIVATE ROUTES --- */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <div className="pt-24 container text-white">
                    <h1 className="text-3xl font-bold">Player Dashboard</h1>
                  </div>
                }
              />
            </Route>

            {/* --- ADMIN ROUTES --- */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route
                path="/admin"
                element={
                  <h1 className="pt-24 container text-white">Admin Panel</h1>
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
