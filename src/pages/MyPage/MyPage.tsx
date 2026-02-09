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

import DeleteModal from '@/components/DeleteModal';

import EmptyState from './components/EmptyState';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

type DeleteTarget =
  | { type: 'project'; id: number; label: string }
  | { type: 'retrospective'; id: number; label: string };

const MyPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState<DeleteTarget | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [retros, setRetros] = useState<Retrospective[]>([]);

  const [, /*loading*/ setLoading] = useState(true);
  const [, /*error*/ setError] = useState('');

  const openDeleteModal = (target: DeleteTarget) => {
    setTarget(target);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTarget(null);
  };

  const fetchAll = async () => {
    try {
      setError('');
      setLoading(true);

      const [pRes, rRes] = await Promise.all([getMyProjects(), getMyRetrospectives()]);

      if (pRes.status === 'success' && pRes.data) setProjects(pRes.data.projects);
      else setProjects([]);

      if (rRes.status === 'success' && rRes.data) setRetros(rRes.data.retrospectives);
      else setRetros([]);
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
        const res = await deleteRetrospective(target.id);
        if (res.status === 'success') {
          setRetros((prev) => prev.filter((r) => r.id !== target.id));
        } else {
          console.log(res.message);
        }
      }

      if (target.type === 'project') {
        const res = await deleteProject(target.id);
        if (res.status === 'success') {
          setProjects((prev) => prev.filter((p) => p.id !== target.id));
        } else {
          console.log(res.message);
        }
      }
    } catch {
      console.log('삭제 중 오류가 발생했습니다.');
    } finally {
      closeModal();
    }
  };

  const modalDescription = useMemo(() => {
    if (!target) return '';
    return `선택하신 "${target.label}" 항목을 영구적으로 삭제할까요?`;
  }, [target]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await postLogout();
      if (res.status !== 'success') {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  return (
    <div className="mt-10 flex flex-col justify-center px-20.5">
      <h1 className="text-[42px] font-bold text-black">마이페이지</h1>
      <section className="mt-10.5 mb-20 w-full">
        <h2 className="text-secondary-900 mb-6 text-[24px] font-medium">완료한 프로젝트</h2>
        {projects.length === 0 ? (
          <EmptyState
            title="완료된 프로젝트가 없어요"
            description="프로젝트를 마무리하면 이곳에서 확인할 수 있어요"
          />
        ) : (
          <div className="border-neutral-30 overflow-hidden border">
            <table className="w-full bg-white text-left text-sm">
              <thead className="border-b-neutral-30 bg-neutral-10 text-black">
                <tr className="whitespace-nowrap">
                  <th className="p-4">프로젝트명</th>
                  <th className="w-30 p-4">역할</th>
                  <th className="w-30 p-4">시작일</th>
                  <th className="w-30 p-4">종료일</th>
                  <th className="w-20 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b-neutral-30 font-medium whitespace-nowrap text-black"
                  >
                    <td className="p-4">{p.name}</td>
                    <td className="p-4">{p.roles.join(', ')}</td>
                    <td className="p-4">{formatDate(p.createdAt)}</td>
                    <td className="p-4">{formatDate(p.closedAt)}</td>
                    <td
                      className="text-primary-500 cursor-pointer p-4 text-right"
                      onClick={() => openDeleteModal({ type: 'project', id: p.id, label: p.name })}
                    >
                      삭제
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10.5 w-full">
        <h2 className="text-secondary-900 mb-6 text-[24px] font-medium">나의 회고</h2>
        {retros.length === 0 ? (
          <EmptyState
            title="작성한 회고가 없어요"
            description="프로젝트를 완료한 뒤 회고를 작성하면 이곳에서 모아볼 수 있어요"
          />
        ) : (
          <div className="border-neutral-30 overflow-hidden border">
            <table className="w-full bg-white text-left text-sm">
              <thead className="border-b-neutral-30 bg-neutral-10 text-black">
                <tr className="whitespace-nowrap">
                  <th className="p-4">제목</th>
                  <th className="w-30 p-4">만든 날짜</th>
                  <th className="w-20 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {retros.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b-neutral-30 font-medium whitespace-nowrap text-black"
                  >
                    <td className="p-4">{r.title}</td>
                    <td className="p-4">{formatDate(r.createdAt)}</td>
                    <td
                      className="text-primary-500 cursor-pointer p-4 text-right"
                      onClick={() =>
                        openDeleteModal({ type: 'retrospective', id: r.id, label: r.title })
                      }
                    >
                      삭제
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <h2 className="text-primary-500 mt-20 text-[24px] font-bold" onClick={handleLogout}>
        로그아웃
      </h2>

      <DeleteModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="항목 삭제"
        description={modalDescription}
      ></DeleteModal>
    </div>
  );
};

export default MyPage;
