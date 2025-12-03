import keycloak from "@/lib/keycloak";

const API_URL = "http://localhost:3333/api"; // Adjust if your port differs

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${keycloak.token}`,
});

export async function getTournamentMatchesAPI(tournamentId: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/matches`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function getPublicTournamentMatchesAPI(tournamentId: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/public-matches`);
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function createMatchAPI(tournamentId: number | string, data: any) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/matches`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create match");
  return res.json();
}

export async function updateMatchAPI(matchId: number | string, data: any) {
  const res = await fetch(`${API_URL}/matches/${matchId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update match");
  return res.json();
}

export async function deleteMatchAPI(matchId: number | string) {
  const res = await fetch(`${API_URL}/matches/${matchId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete match");
  return true;
}

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

export async function generateGroupMatchesAPI(tournamentId: number | string, payload: { groups: { id: string; name: string; teams: { id: number }[] }[] }) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/generate-group-matches`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to generate group matches");
  }
  return res.json();
}