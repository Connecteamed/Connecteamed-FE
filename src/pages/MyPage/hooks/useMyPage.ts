import { useEffect, useMemo, useState } from 'react';

import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { postLogout } from '@/apis/auth';
import {
  deleteProject,
  deleteRetrospective,
  getMyProjects,
  getMyRetrospectives,
} from '@/apis/mypage';
import type { Project, Retrospective } from '@/types/mypage';

export type DeleteTarget =
  | { type: 'project'; id: number; label: string }
  | { type: 'retrospective'; id: number; label: string };

type DeleteProjectErrorData = {
  code?: string;
};

const DELETED_PROJECT_IDS_KEY = 'mypage_deleted_project_ids';

const getDeletedProjectIds = (): number[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(DELETED_PROJECT_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === 'number');
  } catch {
    return [];
  }
};

const addDeletedProjectId = (projectId: number) => {
  if (typeof window === 'undefined') return;

  const prev = getDeletedProjectIds();
  if (prev.includes(projectId)) return;

  localStorage.setItem(DELETED_PROJECT_IDS_KEY, JSON.stringify([...prev, projectId]));
};

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
        const deletedProjectIds = new Set(getDeletedProjectIds());
        setProjects(projectResponse.data.projects.filter((project) => !deletedProjectIds.has(project.id)));
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
        try {
          const response = await deleteProject(target.id);
          if (response.status === 'success') {
            addDeletedProjectId(target.id);
            setProjects((prev) => prev.filter((item) => item.id !== target.id));
          } else {
            console.log(response.message);
          }
        } catch (error) {
          const axiosError = error as AxiosError<DeleteProjectErrorData>;
          const errorCode = axiosError.response?.data?.code;
          const errorStatus = axiosError.response?.status;

          if (errorCode === 'PROJECT_ALREADY_DELETED' || errorStatus === 404) {
            addDeletedProjectId(target.id);
            setProjects((prev) => prev.filter((item) => item.id !== target.id));
          } else {
            throw error;
          }
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
  };
};
