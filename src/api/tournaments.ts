import { getAuthHeaders } from "@/lib/auth";

const API_URL = "http://localhost:3333/api";

// --- PUBLIC ROUTES (No Token Check Needed) ---

export async function getTournamentsAPI() {
  const res = await fetch(`${API_URL}/tournaments`);
  if (!res.ok) throw new Error("Failed to fetch tournaments");
  return res.json();
}

export async function getTournamentByIdAPI(id: string) {
  const res = await fetch(`${API_URL}/tournaments/${id}`);
  if (!res.ok) throw new Error("Failed to fetch tournament");
  return res.json();
}

// --- PROTECTED ROUTES ---

export async function createTournamentAPI(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    window.location.reload();
    throw new Error("Unauthorized: Session expired");
  }
  if (res.status === 403) throw new Error("Forbidden");
  if (!res.ok) throw new Error("Failed to create tournament");

  return res.json();
}

export async function generateGroupStageAPI(id: number | string, config: { groups: number, bestOf: number }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${id}/generate-groups`, {
    method: "POST",
    headers,
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to generate groups");
  }
  return res.json();
}

export async function updateTournamentAPI(id: number | string, data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    window.location.reload();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Failed to update tournament");
  return res.json();
}

export async function deleteTournamentAPI(id: number | string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${id}`, {
    method: "DELETE",
    headers,
  });

  if (res.status === 401) {
    window.location.reload();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Failed to delete tournament");
  return true;
}

export async function registerTeamForTournamentAPI(tournamentId: number | string, paymentProofUrl: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/register`, {
    method: "POST",
    headers,
    body: JSON.stringify({ payment_proof_url: paymentProofUrl }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}

export async function withdrawRegistrationAPI(tournamentId: number | string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/register`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to withdraw registration");
  }
  return true;
}

export async function getTournamentTeamsAPI(tournamentId: number | string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/teams`, {
    headers,
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
}

export async function getPublicTournamentTeamsAPI(tournamentId: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/public-teams`);
  if (!res.ok) throw new Error("Failed to fetch public roster");
  return res.json();
}

// --- ADMIN ROUTES ---

export async function updateRegistrationStatusAPI(regId: number, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/registrations/${regId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status, rejection_reason: rejectionReason })
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function getPaymentProofAPI(regId: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/registrations/${regId}/proof`, {
    headers
  });
  if (!res.ok) throw new Error("Failed to get proof URL");
  return res.json();
}

export async function assignTeamsToGroupsAPI(
  tournamentId: number | string,
  assignments: { teamId: number; groupName: string | null }[]
) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/assign-groups`, {
    method: "POST",
    headers,
    body: JSON.stringify({ assignments }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to assign groups");
  }
  return res.json();
}

export async function createTournamentStageAPI(
  tournamentId: number | string,
  name: string
) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/stages`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Failed to create stage");
  return res.json();
}

export async function bulkUpdateMatchesAPI(
  tournamentId: number | string,
  matchIds: number[],
  updates: any
) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/matches/bulk`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ matchIds, updates }),
  });

  if (!res.ok) throw new Error("Failed to bulk update matches");
  return res.json();
}

export async function getTournamentGroupsAPI(tournamentId: number | string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/groups`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
}