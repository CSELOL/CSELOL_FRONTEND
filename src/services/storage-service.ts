import { getAccessToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

const API_URL = "http://localhost:3333/api";

const getAuthHeaders = async () => {
  const token = await getAccessToken();
  return {
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};

// --- GENERIC LOCAL UPLOAD FUNCTION ---
async function uploadToBackend(file: File, folderType: 'team' | 'tournament'): Promise<string> {
  const formData = new FormData();

  // 1. APPEND 'TYPE' FIRST (Crucial for Backend to see it)
  formData.append('type', folderType);

  // 2. APPEND 'FILE' SECOND
  formData.append('file', file);

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/files/upload`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Failed to upload file");
  }

  const data = await res.json();
  return data.url;
}

/**
 * Uploads a Team Logo to Supabase public bucket
 */
export async function uploadLogo(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `team-logos/${fileName}`;

  const { error } = await supabase.storage
    .from("public-assets")
    .upload(filePath, file);

  if (error) {
    console.error("Supabase Upload Error:", error);
    throw new Error("Failed to upload image.");
  }

  const { data } = supabase.storage
    .from("public-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Uploads Tournament Assets (Banner/Logo) to the LOCAL BACKEND.
 */
export async function uploadTournamentAsset(file: File, _type: 'banner' | 'logo'): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  return uploadToBackend(file, 'tournament');
}

/**
 * Deletes a file via the Local Backend API or Supabase.
 */
export async function deleteAsset(fullUrl: string) {
  if (!fullUrl) return;

  // Check if it's a local URL
  if (fullUrl.includes(API_URL.replace('/api', ''))) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/files/delete`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify({ fileUrl: fullUrl })
      });

      if (!res.ok) console.error("Failed to delete file on backend");
    } catch (error) {
      console.error("Network error deleting file", error);
    }
  }
  // Handle Supabase Deletion
  else if (fullUrl.includes("supabase")) {
    const path = fullUrl.split("/public-assets/")[1];
    if (path) {
      await supabase.storage.from("public-assets").remove([path]);
    }
  }
}

/**
 * Uploads a PRIVATE payment proof to Supabase.
 */
export async function uploadPaymentProof(file: File): Promise<string> {
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    throw new Error("Only images or PDFs are allowed.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `proofs/${fileName}`;

  const { data, error } = await supabase.storage
    .from("private-assets")
    .upload(filePath, file);

  if (error) {
    console.error("Proof Upload Error:", error);
    throw new Error("Failed to upload payment proof.");
  }

  return data.path;
}