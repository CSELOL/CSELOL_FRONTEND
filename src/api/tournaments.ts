const API_URL = "http://localhost:3333/api"; // Adjust to your backend port

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

export async function createTournamentAPI(data: any) {
  const res = await fetch(`${API_URL}/tournaments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create tournament");
  return res.json();
}

// NEW: Update (Used for Editing Settings AND Archiving)
export async function updateTournamentAPI(id: number | string, data: any) {
  const res = await fetch(`${API_URL}/tournaments/${id}`, {
    method: "PUT", // or PATCH depending on your backend
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update tournament");
  return res.json();
}

// NEW: Delete
export async function deleteTournamentAPI(id: number | string) {
  const res = await fetch(`${API_URL}/tournaments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete tournament");
  return true;
}