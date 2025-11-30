import keycloak from "@/lib/keycloak";

const API_URL = "http://localhost:3333/api";

// Helper to get headers with Token
const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${keycloak.token}`,
  };
};

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

// --- PROTECTED ROUTES (Includes 401 Safety Net) ---

export async function createTournamentAPI(data: any) {
  const res = await fetch(`${API_URL}/tournaments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  // 1. Session Expiry Check
  if (res.status === 401) {
    window.location.reload(); // Force reload to trigger re-auth
    throw new Error("Unauthorized: Session expired");
  }

  // 2. Role Check
  if (res.status === 403) {
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  // 3. Generic Error
  if (!res.ok) {
    throw new Error("Failed to create tournament");
  }
  
  return res.json();
}

export async function updateTournamentAPI(id: number | string, data: any) {
  const res = await fetch(`${API_URL}/tournaments/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  // Session Expiry Check
  if (res.status === 401) {
    window.location.reload();
    throw new Error("Unauthorized: Session expired");
  }

  if (!res.ok) throw new Error("Failed to update tournament");
  return res.json();
}

export async function deleteTournamentAPI(id: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  
  // Session Expiry Check
  if (res.status === 401) {
    window.location.reload();
    throw new Error("Unauthorized: Session expired");
  }
  
  if (!res.ok) throw new Error("Failed to delete tournament");
  return true;
}

export async function registerTeamForTournamentAPI(tournamentId: number | string, paymentProofUrl: string) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ payment_proof_url: paymentProofUrl }), // Send it in body
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}

// 1. For Admin Panel (Requires Token)
export async function getTournamentTeamsAPI(tournamentId: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/teams`, {
    headers: getAuthHeaders(), // Protected
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
}

// 2. For Public Pages (No Token)
export async function getPublicTournamentTeamsAPI(tournamentId: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/public-teams`); // Public URL
  if (!res.ok) throw new Error("Failed to fetch public roster");
  return res.json();
}

// Update Registration Status
export async function updateRegistrationStatusAPI(regId: number, status: 'APPROVED' | 'REJECTED') {
  const res = await fetch(`${API_URL}/registrations/${regId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

// Get Proof URL
export async function getPaymentProofAPI(regId: number) {
  const res = await fetch(`${API_URL}/registrations/${regId}/proof`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to get proof URL");
  return res.json(); // returns { url: "..." }
}