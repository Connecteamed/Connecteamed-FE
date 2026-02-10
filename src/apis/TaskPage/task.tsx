import type {
    PatchTaskAssigneesRequest,
    PatchTaskScheduleRequest,
    PatchTaskStatusRequest,
    RequestPostTaskDTO,
    ResponseTaskDTO,
} from "@/types/TaskManagement/task";
import { instance } from "../axios"
// import type { ApiResponse } from "@/types";

export const getTaskList = async (projectId: number): Promise<ResponseTaskDTO> => {
    const { data } = await instance.get(`/projects/${projectId}/tasks`);
    return (data?.data ?? []) as ResponseTaskDTO;
}

export const postTask = async (projectId: number, RequestPostTaskDTO: RequestPostTaskDTO) => {
    const {data} = await instance.post(`/projects/${projectId}/tasks`, RequestPostTaskDTO);
    return data;
}

export const patchTaskStatus = async (
    taskId: string | number,
    body: PatchTaskStatusRequest,
) => {
    const { data } = await instance.patch(`/tasks/${taskId}/status`, body);
    return data;
};

export const patchTaskSchedule = async (
    taskId: string | number,
    body: PatchTaskScheduleRequest,
) => {
    const { data } = await instance.patch(`/tasks/${taskId}/schedule`, body);
    return data;
};

export const patchTaskAssignees = async (
    taskId: string | number,
    body: PatchTaskAssigneesRequest,
) => {
    const { data } = await instance.patch(`/tasks/${taskId}/assignees`, body);
    return data;
};

export const patchTask = async (projectId: number, taskId: number, RequestPostTaskDTO: RequestPostTaskDTO) => {
    const {data} = await instance.patch(`/projects/${projectId}/tasks/${taskId}`, RequestPostTaskDTO);
    return data;
}

export const deleteTask = async (taskId: string | number) => {
    const { data } = await instance.delete(`/tasks/${taskId}`);
    return data;
};