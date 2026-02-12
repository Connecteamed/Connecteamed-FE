import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { postLogout } from '@/apis/auth';
import {
  deleteProject,
  deleteRetrospective,
  getMyProjects,
  getMyRetrospectives,
} from '@/apis/mypage';
import { getRetrospectives } from '@/apis/retrospective';
import type { Project, Retrospective } from '@/types/mypage';

export type DeleteTarget =
  | { type: 'project'; id: number; label: string }
  | { type: 'retrospective'; id: number; label: string };

export const useMyPage = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [target, setTarget] = useState<DeleteTarget | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [retros, setRetros] = useState<Retrospective[]>([]);

  const [, /*loading,*/ setLoading] = useState(true);
  const [, /*error,*/ setError] = useState('');

  const navigate = useNavigate();

  const openDeleteModal = (deleteTarget: DeleteTarget) => {
    setTarget(deleteTarget);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTarget(null);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const fetchAll = async () => {
    try {
      setError('');
      setLoading(true);

      const [projectResponse, retrospectiveResponse] = await Promise.all([
        getMyProjects(),
        getMyRetrospectives(),
      ]);

      if (projectResponse.status === 'success' && projectResponse.data) {
        setProjects(projectResponse.data.projects);
      } else {
        setProjects([]);
      }

      if (retrospectiveResponse.status === 'success' && retrospectiveResponse.data) {
        setRetros(retrospectiveResponse.data.retrospectives);
      } else {
        setRetros([]);
      }
    } catch {
      setError('마이페이지 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAll();
  }, []);

  const handleDelete = async () => {
    if (!target) return;

    try {
      if (target.type === 'retrospective') {
        const response = await deleteRetrospective(target.id);
        if (response.status === 'success') {
          setRetros((prev) => prev.filter((item) => item.id !== target.id));
        } else {
          console.log(response.message);
        }
      }

      if (target.type === 'project') {
        const response = await deleteProject(target.id);
        if (response.status === 'success') {
          setProjects((prev) => prev.filter((item) => item.id !== target.id));
        } else {
          console.log(response.message);
        }
      }
    } catch {
      console.log('삭제 중 오류가 발생했습니다.');
    } finally {
      closeDeleteModal();
    }
  };

  const handleLogout = async () => {
    closeLogoutModal();

    try {
      const response = await postLogout();
      if (response.status !== 'success') {
        console.log(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const openProjectPage = (projectId: number) => {
    navigate(`/team/${projectId}`);
  };

  const parseProjectId = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  };

  const getProjectIdCandidates = async (): Promise<number[]> => {
    const idsFromState = projects
      .map((project) => parseProjectId(project.id))
      .filter((id): id is number => id !== null);

    if (idsFromState.length > 0) {
      return idsFromState;
    }

    try {
      const response = await getMyProjects();
      if (response.status !== 'success' || !response.data) {
        return [];
      }

      return response.data.projects
        .map((project) => parseProjectId(project.id))
        .filter((id): id is number => id !== null);
    } catch {
      return [];
    }
  };

  const extractDateKey = (value: unknown): string | null => {
    if (typeof value !== 'string') return null;
    const matched = value.match(/\d{4}-\d{2}-\d{2}/);
    return matched ? matched[0] : null;
  };

  const findProjectIdByRetrospective = async (
    retro: Retrospective,
    retrospectiveId: number | null,
  ): Promise<number | null> => {
    const candidateProjectIds = await getProjectIdCandidates();

    if (candidateProjectIds.length === 0) {
      return null;
    }

    const targetTitle = retro.title?.trim();
    const targetDateKey = extractDateKey(retro.createdAt);

    const matchedProjectIds = await Promise.all(
      candidateProjectIds.map(async (projectId) => {
        try {
          const retrospectiveList = await getRetrospectives(projectId);
          const hasRetrospective = retrospectiveList.some((item) => {
            const itemRetrospectiveId = parseProjectId(item.retrospectiveId);
            if (retrospectiveId !== null && itemRetrospectiveId === retrospectiveId) {
              return true;
            }

            const itemTitle = item.title?.trim();
            const itemDateKey = extractDateKey(item.createdAt);

            return (
              Boolean(targetTitle) &&
              itemTitle === targetTitle &&
              (!targetDateKey || itemDateKey === targetDateKey)
            );
          });

          return hasRetrospective ? projectId : null;
        } catch {
          return null;
        }
      }),
    );

    return matchedProjectIds.find((id): id is number => id !== null) ?? null;
  };

  const openRetrospectivePage = async (retro: Retrospective) => {
    const retroWithFallback = retro as Retrospective & {
      projectID?: unknown;
      teamID?: unknown;
      retrospectiveId?: unknown;
      project?: { id?: unknown; projectId?: unknown; teamId?: unknown };
      team?: { id?: unknown; teamId?: unknown };
    };

    const linkedProjectIdFromPayload = [
      retro.projectId,
      retro.teamId,
      retroWithFallback.projectID,
      retroWithFallback.teamID,
      retroWithFallback.project?.id,
      retroWithFallback.project?.projectId,
      retroWithFallback.project?.teamId,
      retroWithFallback.team?.id,
      retroWithFallback.team?.teamId,
    ]
      .map(parseProjectId)
      .find((id): id is number => id !== null);

    const linkedRetrospectiveId =
      parseProjectId(retro.id) ?? parseProjectId(retroWithFallback.retrospectiveId);

    const linkedProjectId =
      linkedProjectIdFromPayload ??
      (await findProjectIdByRetrospective(retro, linkedRetrospectiveId));

    if (!linkedProjectId) {
      alert('연결된 프로젝트를 찾지 못했어요.');
      return;
    }

    const navigationState: { selectedTask: '6'; retrospectiveId?: number } = {
      selectedTask: '6',
    };

    if (linkedRetrospectiveId !== null) {
      navigationState.retrospectiveId = linkedRetrospectiveId;
    }

    navigate(`/team/${linkedProjectId}`, {
      state: navigationState,
    });
  };

  const modalDescription = useMemo(() => {
    if (!target) return '';
    return `정말 삭제 하시겠어요?`;
  }, [target]);

  return {
    projects,
    retros,
    isDeleteModalOpen,
    isLogoutModalOpen,
    modalDescription,
    openDeleteModal,
    closeDeleteModal,
    openLogoutModal,
    closeLogoutModal,
    handleDelete,
    handleLogout,
    openProjectPage,
    openRetrospectivePage,
  };
};
