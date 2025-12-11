import { getAccessToken } from "@/lib/auth";

const API_URL = "http://localhost:3333/api";

const getAuthHeaders = async () => {
  const token = await getAccessToken();
  return {
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};

// --- TEAM LOGO UPLOAD ---
async function uploadTeamLogo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/files/team-logo`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Failed to upload team logo");
  }

  const data = await res.json();
  return data.url;
}

// --- TOURNAMENT ASSET UPLOAD ---
async function uploadTournamentAssetToBackend(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/files/tournament-asset`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Failed to upload tournament asset");
  }

  const data = await res.json();
  return data.url;
}

/**
 * Uploads a Team Logo via the backend API.
 */
export async function uploadLogo(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  return uploadTeamLogo(file);
}

/**
 * Uploads Tournament Assets (Banner/Logo) to the LOCAL BACKEND.
 */
export async function uploadTournamentAsset(file: File, _type: 'banner' | 'logo'): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  return uploadTournamentAssetToBackend(file);
}

/**
 * Deletes a file via the Backend API.
 * Backend handles Supabase storage deletion using service role key.
 */
export async function deleteAsset(fileUrl: string) {
  if (!fileUrl) return;

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/files/delete`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: JSON.stringify({ fileUrl })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Delete failed" }));
      console.error("Failed to delete file:", err);
    }
  } catch (error) {
    console.error("Network error deleting file", error);
  }
}

/**
 * Uploads a PRIVATE payment proof via the backend API.
 * Returns the file path (not a public URL since it's private).
 */
export async function uploadPaymentProof(file: File): Promise<string> {
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    throw new Error("Only images or PDFs are allowed.");
  }

  const formData = new FormData();
  formData.append('file', file);

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/files/payment-proof`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    console.error("Payment Proof Upload Error:", err);
    throw new Error(err.error || "Failed to upload payment proof.");
  }

  const data = await res.json();
  return data.path; // Returns path like "payment-proofs/uuid.pdf"
}