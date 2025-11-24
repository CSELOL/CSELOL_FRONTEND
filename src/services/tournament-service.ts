import { mockRequest } from "./api";
// import { api } from "./api"; // Keep for real implementation

export interface Tournament {
  id: number;
  name: string;
  status: "OPEN" | "FULL" | "COMPLETED";
  date: string;
  prize: string;
  slots: string;
  minRank: string;
  img: string;
}

const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 1,
    name: "Season 5 - Split 1",
    status: "OPEN",
    date: "May 15",
    prize: "R$ 5.000",
    slots: "8/16",
    minRank: "Open",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Community Cup #4",
    status: "FULL",
    date: "June 01",
    prize: "RP Points",
    slots: "32/32",
    minRank: "Gold+",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Season 4 Finals",
    status: "COMPLETED",
    date: "Jan 10",
    prize: "R$ 10.000",
    slots: "16/16",
    minRank: "Open",
    img: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2070&auto=format&fit=crop",
  },
];

export const TournamentService = {
  getAll: async (): Promise<Tournament[]> => {
    // return api.get("/tournaments");
    return mockRequest(MOCK_TOURNAMENTS);
  },

  getById: async (id: number): Promise<Tournament | undefined> => {
    // return api.get(`/tournaments/${id}`);
    return mockRequest(MOCK_TOURNAMENTS.find((t) => t.id === id));
  },

  registerTeam: async (_tournamentId: number, _teamId: number) => {
    // return api.post(`/tournaments/${_tournamentId}/register`, { teamId: _teamId });
    return mockRequest({ success: true, message: "Registered successfully" });
  },
};
