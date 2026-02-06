import type { ResponseTeamListDTO } from "@/types/TaskManagement/team";
import { instance } from "../axios";

export const getTeamList = async (): Promise<ResponseTeamListDTO> => {
  const { data } = await instance.get<ResponseTeamListDTO>("/teams/my");
  return data;
};