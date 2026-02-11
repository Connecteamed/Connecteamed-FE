import { useEffect, useMemo, useState } from 'react';

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
