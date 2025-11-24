import { mockRequest } from "./api";
// import { api } from "./api"; // Keep for real implementation

export interface TeamMember {
  id: number;
  name: string;
  role: "Captain" | "Member";
  position: string;
  avatar: string | null;
}

export interface Team {
  id: number;
  name: string;
  tag: string;
  inviteCode: string;
  stats: { wins: number; losses: number; ranking: number };
  members: TeamMember[];
}

const MOCK_MY_TEAM: Team = {
  id: 101,
  name: "Sergipe Slayers",
  tag: "SLY",
  inviteCode: "SLY-8823-X9",
  stats: { wins: 12, losses: 2, ranking: 1 },
  members: [
    {
      id: 1,
      name: "FakerSE",
      role: "Captain",
      position: "Mid",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: 2,
      name: "TitanLagarto",
      role: "Member",
      position: "Top",
      avatar: null,
    },
    {
      id: 3,
      name: "CajuJungle",
      role: "Member",
      position: "Jungle",
      avatar: null,
    },
    {
      id: 4,
      name: "ViperAracaju",
      role: "Member",
      position: "ADC",
      avatar: null,
    },
    {
      id: 5,
      name: "SupportKing",
      role: "Member",
      position: "Support",
      avatar: null,
    },
  ],
};

export const TeamService = {
  getMyTeam: async (): Promise<Team> => {
    // return api.get("/teams/me");
    return mockRequest(MOCK_MY_TEAM);
  },

  create: async (data: { name: string; tag: string }) => {
    // return api.post("/teams", data);
    return mockRequest({ ...MOCK_MY_TEAM, ...data });
  },

  join: async (_inviteCode: string) => {
    // return api.post("/teams/join", { inviteCode: _inviteCode });
    return mockRequest({ success: true, team: MOCK_MY_TEAM });
  },
};
