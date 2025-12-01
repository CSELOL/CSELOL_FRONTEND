import keycloak from "@/lib/keycloak";

const API_URL = "http://localhost:3333/api"; // Adjust if your port differs

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${keycloak.token}`,
});

// Get all matches for a specific tournament
export async function getTournamentMatchesAPI(tournamentId: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/matches`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

// Generate the initial bracket structure
export async function generateBracketAPI(tournamentId: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/generate-bracket`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to generate bracket");
  }
  return res.json();
}

// Update a match (Score, Date, Status)
export async function updateMatchAPI(matchId: number | string, data: any) {
  const res = await fetch(`${API_URL}/matches/${matchId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update match");
  return res.json();
}

// Create a single match manually
export async function createMatchAPI(tournamentId: number | string, data: any) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/matches`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create match");
  }
  return res.json();
}

// Delete a match
export async function deleteMatchAPI(matchId: number | string) {
  const res = await fetch(`${API_URL}/matches/${matchId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete match");
  return true;
}