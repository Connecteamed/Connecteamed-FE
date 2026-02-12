import { instance } from "../axios";

export async function getCompletedTeamList() {
  const res = await instance.get('/mypage/projects/completed');
  return res.data;
}
