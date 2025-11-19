/* 
// Import this at the top
import { ProtectedRoute } from "./components/auth/protected-route";

// Inside <Routes> ...

// --- PROTECTED PLAYER ROUTES ---
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="team" element={<MyTeamPage />} />
    <Route path="matches" element={<PlayerMatchesPage />} />
    <Route path="settings" element={<h1 className="text-white p-8">Settings</h1>} />
  </Route>
</Route>

// --- PROTECTED ADMIN ROUTES ---
<Route element={<ProtectedRoute role="admin" />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<h1 className="text-white text-2xl font-bold">Admin Overview</h1>} />
    <Route path="tournaments" element={<AdminTournamentsPage />} />
    <Route path="users" element={<h1 className="text-white">User Management</h1>} />
    <Route path="settings" element={<h1 className="text-white">System Settings</h1>} />
  </Route>
</Route>
*/