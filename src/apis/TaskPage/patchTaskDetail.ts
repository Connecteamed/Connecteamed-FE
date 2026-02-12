import { instance } from "../axios";

export interface PatchTaskDetailParams {
  title: string;
  status: string;
  assigneeIds: number[];
  startDate: string;
  endDate: string;
  contents: string;
  noteContent: string;
}

export async function patchTaskDetail(taskId: number, params: PatchTaskDetailParams) {
  const res = await instance.patch(`tasks/${taskId}`, params);
  return res.data;
}
