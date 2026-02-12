// useCloseProject.ts
import { closeProject } from '@/apis/MakeProject/closeProject';
import type { CloseProjectResponse } from '@/types/MakeProject/closeProject';

export const useCloseProject = async (
  projectId: number
): Promise<CloseProjectResponse> => {
  try {
    const response = await closeProject(projectId);
    return response;
  } catch (error) {
    // 필요하면 에러 로깅
    console.error('프로젝트 종료 실패:', error);
    throw error;
  }
};
