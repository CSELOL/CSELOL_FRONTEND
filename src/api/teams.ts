import keycloak from "@/lib/keycloak";

const API_URL = "http://localhost:3333/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${keycloak.token}`,
});

export interface Team {
  id: number;
  name: string;
  tag: string;
  logo_url: string;
  description: string;
  status: string;
  social_media: {
    twitter?: string;
    instagram?: string;
    twitch?: string;
    youtube?: string;
    others?: string[];
  };
  captain_id: string;
}

export interface TeamMember {
  id: number;
  keycloak_id: string;
  nickname: string;
  avatar_url: string | null;
  team_role: string; // 'CAPTAIN', 'MEMBER'
  primary_role: string; // 'MID', 'TOP', etc
}

export async function createTeamAPI(data: any) {
  const res = await fetch(`${API_URL}/teams`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (res.status === 401) throw new Error("Unauthorized");
  if (res.status === 409) throw new Error("Name or Tag already taken");
  if (!res.ok) throw new Error("Failed to create team");

  return res.json();
}

export async function getPublicTeamsAPI() {
  const res = await fetch(`${API_URL}/teams`);
  if (!res.ok) throw new Error("Failed to load teams");
  return res.json();
}

export async function getMyTeamAPI() {
  const res = await fetch(`${API_URL}/teams/my-team`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (res.status === 404) return null; // User has no team
  if (!res.ok) throw new Error("Failed to fetch my team");

  return res.json();
}

export async function joinTeamAPI(code: string) {
  const res = await fetch(`${API_URL}/teams/join`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });

  if (res.status === 404) throw new Error("Invalid invite code.");
  if (res.status === 409) throw new Error("You are already in a team.");
  if (!res.ok) throw new Error("Failed to join team.");

  return res.json();
}

export async function getTeamMembersAPI(teamId: number) {
  const res = await fetch(`${API_URL}/teams/${teamId}/members`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch roster.");
  return res.json();
}

export async function refreshTeamInviteCodeAPI(teamId: number) {
  const res = await fetch(`${API_URL}/teams/${teamId}/refresh-code`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (res.status === 403) throw new Error("Only captain can refresh code");
  if (!res.ok) throw new Error("Failed to refresh invite code");

  return res.json();
}

export async function transferTeamOwnershipAPI(teamId: number, newCaptainId: string) {
  const res = await fetch(`${API_URL}/teams/${teamId}/transfer-ownership`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ newCaptainId }),
  });

  if (res.status === 403) throw new Error("Only captain can transfer ownership");
  if (!res.ok) throw new Error("Failed to transfer ownership");

  return res.json();
}

export async function getMyTeamMatchesAPI() {
  const res = await fetch(`${API_URL}/teams/my-team/matches`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch team matches");
  return res.json();
}

export async function getMyTeamTournamentsAPI() {
  const res = await fetch(`${API_URL}/teams/my-team/tournaments?_=${Date.now()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch team tournaments");
  return res.json();
}