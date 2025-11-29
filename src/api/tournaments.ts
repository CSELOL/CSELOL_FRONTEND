import axios from "axios";

const API_URL = "http://localhost:3333";

export async function createTournamentAPI(payload: any) {
  const res = await axios.post(`${API_URL}/tournaments`, payload);
  return res.data;
}

export async function getTournamentsAPI() {
  const res = await axios.get(`${API_URL}/tournaments`);
  return res.data;
}
