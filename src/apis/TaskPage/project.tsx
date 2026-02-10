import type { ApiResponse } from '@/types';
import type {
  ProjectCreateResponse,
  RequestMakeProjectDTO,
  ResponseProjectInviteCodeDTO,
  ResponseProjectMemberDTO,
  ResponseProjectRoleDTO,
} from '@/types/TaskManagement/project';

import { instance } from '..';

export const postMakeProject = async (
  projectData: RequestMakeProjectDTO,
): Promise<ApiResponse<ProjectCreateResponse>> => {
  const { image, ...json } = projectData;

  // multipart/form-data 바디 + JSON 문자열은 query param `json`
  const params = {
    json: JSON.stringify(json),
  };

  const formData = new FormData();
  if (image) {
    formData.append('image', image);
  }

  const { data } = await instance.post<ApiResponse<ProjectCreateResponse>>('/projects', formData, {
    params,
  });
  return data;
};


export const getProjectRoleList = async (projectId: number) => {
  const { data } = await instance.get<ApiResponse<ResponseProjectRoleDTO>>(
    `/projects/${projectId}/roles`,
  );
  return data;
};

export const getProjectMemberList = async (projectId: number): Promise<ResponseProjectMemberDTO> => {
  // API returns ApiResponse<ResponseProjectMemberDTO> where data is an array of members
  const { data } = await instance.get<ApiResponse<ResponseProjectMemberDTO>>(
    `/projects/${projectId}/members`,
  );

  return data.data ?? [];
};

export const patchMemberRole = async (projectId: number, memberId: number, roleIds: number[]) => {
  const { data } = await instance.patch<ApiResponse<{ members: ResponseProjectMemberDTO[] }>>(
    `/projects/${projectId}/members/${memberId}/roles`,
    { roleIds },
  );
  return data;
};

export const getProjectInviteCode = async (projectId: number) => {
    const { data } = await instance.get<ApiResponse<ResponseProjectInviteCodeDTO>>(
      `/invite/${projectId}`,
    );
    return data;
}

export const postProjectJoin = async (inviteCode: string) => {
  const { data } = await instance.post<ApiResponse<null>>(
    `/invite/join`,
    { inviteCode },
  );
  return data;
}