import { useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { getMyProjects } from '@/apis/mypage';
import { QUERY_KEY } from '@/constants/key';
import type { CompleteTask } from '@/types/TaskManagement/taskComplete';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import DeleteModal from '@/components/DeleteModal';

import { useDeleteRetrospective } from '@/hooks/TaskPage/Mutate/useDeleteRetrospective';
import useGetCompletedTasks from '@/hooks/TaskPage/Query/useGetCompletedTasks';
import { useGetRetrospectives } from '@/hooks/TaskPage/Query/useGetRetrospectives';

import CreateReviewModal from './CreateReviewModal';
import EmptyAIReview from './EmptyAIReview';
import ReviewDetailModal from './ReviewDetailModal';

type TaskForReview = CompleteTask & { included: boolean };

const AIReview = ({ projectId }: { projectId: number }) => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    data: completedTasks,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useGetCompletedTasks(projectId);

  const {
    data: reviews,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = useGetRetrospectives(projectId);

  const { mutate: deleteRetro } = useDeleteRetrospective({ projectId });

  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [excludedTaskIds, setExcludedTaskIds] = useState<number[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 마이페이지에서 회고 눌렀을 때 바로 회고 자세히보기로 가는 로직
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(() => {
    const state = location.state as { retrospectiveId?: unknown } | null;
    const retrospectiveId = state?.retrospectiveId;

    if (typeof retrospectiveId === 'number' && Number.isFinite(retrospectiveId)) {
      return retrospectiveId;
    }

    if (typeof retrospectiveId === 'string') {
      const parsed = Number(retrospectiveId);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  });

  const tasksForReview = useMemo<TaskForReview[]>(() => {
    if (!completedTasks?.data?.tasks) return [];
    return completedTasks.data.tasks.map((task) => ({
      ...task,
      included: !excludedTaskIds.includes(task.taskId),
    }));
  }, [completedTasks, excludedTaskIds]);

  const filteredTasks = useMemo(() => {
    if (!showMyTasksOnly) return tasksForReview;
    return tasksForReview.filter((t) => t.isMine);
  }, [showMyTasksOnly, tasksForReview]);

  const selectedTasksForAI = useMemo(() => {
    return tasksForReview.filter((task) => task.included);
  }, [tasksForReview]);

  const handleToggleTaskInclusion = (taskId: number) => {
    setExcludedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId],
    );
  };

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.retrospectiveList, projectId] });
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId === null) return;

    deleteRetro(deleteTargetId, {
      onSuccess: () => {
        setDeleteTargetId(null);
      },
      onError: (error) => {
        const status =
          (error as { response?: { status?: number } }).response?.status ??
          (error as { status?: number }).status;

        // 서버에서 권한 에러(403 등)를 보낼 때의 처리
        if (status === 403) {
          alert('본인이 작성한 회고만 지울 수 있습니다.');
        } else {
          alert('삭제에 실패했습니다. 본인이 작성한 회고인지 확인해주세요.');
        }
        setDeleteTargetId(null);
      },
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return dateStr.split('T')[0].replace(/-/g, '.');
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const { data: myProjectsRes, isLoading: isLoadingProjects } = useQuery({
    queryKey: [QUERY_KEY.myCompletedProjects],
    queryFn: getMyProjects,
  });

  const isProjectCompleted = useMemo(() => {
    const projects = myProjectsRes?.data?.projects ?? [];
    return projects.some((p) => p.id === projectId);
  }, [myProjectsRes, projectId]);

  if (isLoadingTasks || isLoadingReviews || isLoadingProjects) {
    return <div className="py-10 text-center">로딩 중...</div>;
  }

  if (isErrorTasks || isErrorReviews) {
    return <div className="py-10 text-center text-red-500">에러가 발생했습니다.</div>;
  }

  if (!isProjectCompleted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-2xl font-medium">
        AI 회고는 프로젝트 종료 후 가능해요
      </div>
    );
  }

  if (tasksForReview.length === 0 && (!reviews || reviews.length === 0)) {
    return <EmptyAIReview />;
  }

  return (
    <div className="w-full">
      {/* ================= 업무 영역 ================= */}
      {tasksForReview.length > 0 && (
        <>
          <div className="mb-4 flex justify-end">
            <label className="flex items-center gap-2 text-[10px] text-neutral-800">
              <input
                type="checkbox"
                checked={showMyTasksOnly}
                onChange={(e) => setShowMyTasksOnly(e.target.checked)}
                className="accent-primary-500 h-3 w-3"
              />
              <span>내 업무만 보기</span>
            </label>
          </div>

          <div className="mb-10">
            {/* 데스크톱 표 */}
            <div className="hidden md:block">
              <div className="bg-neutral-10 border-neutral-30 flex h-12 items-center border px-5 text-sm font-medium">
                <div className="w-28">업무명</div>
                <div className="flex-1">업무내용</div>
                <div className="w-15 text-center">상태</div>
                <div className="w-28 text-center">시작일</div>
                <div className="w-28 text-center">마감일</div>
                <div className="w-25 text-center">담당자</div>
                <div className="w-8" />
              </div>

              <div className="border-neutral-30 border-x border-b">
                {filteredTasks.map((task) => (
                  <div
                    key={task.taskId}
                    className={`border-neutral-30 flex h-15 items-center border-b px-5 py-3 text-xs last:border-b-0 ${
                      task.included ? 'text-neutral-90' : 'text-neutral-60'
                    }`}
                  >
                    <div className="line-clamp-2 w-28 pr-4 text-xs leading-snug font-medium">
                      {task.title}
                    </div>
                    <div className="line-clamp-1 flex-1 pr-4">{task.contents}</div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        task.included
                          ? 'bg-primary-300 text-neutral-90'
                          : 'text-neutral-60 bg-primary-300'
                      }`}
                    >
                      {task.status === 'DONE' ? '완료' : task.status}
                    </span>

                    <div className="w-28 text-center">{formatDate(task.startDate)}</div>
                    <div className="w-28 text-center">{formatDate(task.endDate)}</div>
                    <div className="line-clamp-1 w-25 px-2 text-center text-xs leading-snug whitespace-normal">
                      {task.assignees.map((a) => a.nickname).join(', ')}
                    </div>

                    <div className="w-8 text-center">
                      <button
                        onClick={() => handleToggleTaskInclusion(task.taskId)}
                        className={`text-xs font-medium ${
                          task.included ? 'text-neutral-70' : 'text-neutral-60'
                        }`}
                      >
                        {task.included ? '제외' : '추가'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 모바일 카드 목록 */}
            <div className="mt-4 space-y-4 md:hidden">
              {filteredTasks.map((task) => (
                <div
                  key={task.taskId}
                  className={`border-neutral-40 rounded-2xl border bg-white px-5 py-4 ${
                    task.included ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="line-clamp-2 text-base font-medium">{task.title}</div>
                      <p className="mt-1 line-clamp-2 text-[10px] font-normal">{task.contents}</p>
                    </div>
                    <button
                      onClick={() => handleToggleTaskInclusion(task.taskId)}
                      className="text-neutral-70 shrink-0 text-xs font-medium"
                    >
                      {task.included ? '제외' : '추가'}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span
                      className={`rounded-full px-3 py-1 font-medium ${
                        task.included
                          ? 'bg-primary-300 text-neutral-90'
                          : 'text-neutral-60 bg-primary-300'
                      }`}
                    >
                      {task.status === 'DONE' ? '완료' : task.status}
                    </span>
                    <span className={task.included ? 'text-neutral-700' : 'text-neutral-400'}>
                      {task.assignees.map((a) => a.nickname).join(', ')}
                    </span>
                    <span
                      className={`ml-auto ${task.included ? 'text-neutral-700' : 'text-neutral-400'}`}
                    >
                      {formatDate(task.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 flex justify-center">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isLoadingTasks || isLoadingReviews || selectedTasksForAI.length === 0}
              className="bg-primary-500 h-12 w-full max-w-105 rounded-md text-white disabled:bg-neutral-400"
            >
              {isLoadingTasks || isLoadingReviews
                ? '로딩 중...'
                : selectedTasksForAI.length === 0
                  ? '회고할 업무를 선택해주세요'
                  : 'AI로 프로젝트 회고하기'}
            </button>
          </div>
        </>
      )}

      {/* ================= 회고 영역 ================= */}
      <div className="text-secondary-900 mb-4 text-2xl font-medium">회고 목록</div>
      {!reviews || reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-3 text-2xl font-medium">저장된 회고가 없어요</div>
          <div className="text-sm font-normal">
            프로젝트를 완료한 뒤 회고를 작성하면 이곳에서 모아볼 수 있어요
          </div>
        </div>
      ) : (
        <div className="mb-10">
          {/* Desktop 리스트 */}
          <div className="hidden md:block">
            <div className="bg-neutral-10 border-neutral-30 flex h-12 items-center border px-5 text-sm font-medium">
              <div className="flex-1">제목</div>
              <div className="w-40 text-center">만든 날짜</div>
              <div className="w-16" />
            </div>

            <div className="border-neutral-30 border-x border-b">
              {reviews.map((review) => (
                <div
                  key={review.retrospectiveId}
                  className="border-neutral-30 flex h-15 items-center border-b px-5 py-3 text-xs last:border-b-0"
                >
                  <div
                    className="line-clamp-1 flex-1 cursor-pointer font-medium hover:text-orange-500"
                    onClick={() => setSelectedReviewId(review.retrospectiveId)}
                  >
                    {review.title}
                  </div>
                  <div className="w-40 text-center">{formatDate(review.createdAt) || '-'}</div>
                  <div className="w-16 text-center">
                    <button
                      onClick={() => setDeleteTargetId(review.retrospectiveId)}
                      className="text-neutral-70 text-xs"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile 카드 리스트 */}
          <div className="space-y-3 md:hidden">
            {reviews.map((review) => (
              <div
                key={review.retrospectiveId}
                className="border-neutral-40 rounded-xl border bg-white px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-1 flex-col">
                    <div
                      className="line-clamp-1 cursor-pointer text-base font-medium text-neutral-900 hover:text-orange-500"
                      onClick={() => setSelectedReviewId(review.retrospectiveId)}
                    >
                      {review.title}
                    </div>
                    <span className="text-neutral-90 mt-1 text-[8px] font-normal">
                      {formatDate(review.createdAt) || '-'}
                    </span>
                  </div>

                  <button
                    onClick={() => setDeleteTargetId(review.retrospectiveId)}
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="회고 삭제"
        description="해당 회고를 삭제할까요?"
      />

      {isCreateModalOpen && (
        <CreateReviewModal
          isOpen
          onClose={handleCloseCreateModal}
          onCreate={handleCreateSuccess}
          selectedTasks={selectedTasksForAI}
          projectId={projectId}
        />
      )}

      {selectedReviewId !== null && (
        <ReviewDetailModal
          isOpen={selectedReviewId !== null}
          onClose={() => setSelectedReviewId(null)}
          projectId={projectId}
          retrospectiveId={selectedReviewId}
        />
      )}
    </div>
  );
};

export default AIReview;
