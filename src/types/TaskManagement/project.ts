export interface ProjectCreatePayload {
  name: string;
  goal: string;
  requiredRoleNames: string[];
}

// 이미지가 있을 경우 multipart/form-data 바디, JSON은 query param(json)으로 전송
export interface RequestMakeProjectDTO extends ProjectCreatePayload {
  image?: File | null;
}

export interface ProjectCreateResponse {
  projectId: number;
  createdAt: string;
}

export interface ProjectRole {
  roleId: number;
  name: string;
}

export interface ResponseProjectRoleDTO {
  roles: ProjectRole[];
}

export interface ProjectMember {
  projectMemberId: number;
  memberId: number;
  memberName: string;
  roles: string[];
}

export interface ResponseProjectInviteCodeDTO {
  inviteCode: string;
  expiredAt: string;
}

export type ResponseProjectMemberDTO = ProjectMember[];
