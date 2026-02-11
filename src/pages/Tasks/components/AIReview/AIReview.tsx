import { useMemo, useState } from 'react';

import { QUERY_KEY } from '@/constants/key';
import type { CompleteTask } from '@/types/TaskManagement/taskComplete';
import { useQueryClient } from '@tanstack/react-query';

import DeleteModal from '@/components/DeleteModal';

import { useDeleteRetrospective } from '@/hooks/TaskPage/Mutate/useDeleteRetrospective';
import useGetCompletedTasks from '@/hooks/TaskPage/Query/useGetCompletedTasks';
import { useGetRetrospectives } from '@/hooks/TaskPage/Query/useGetRetrospectives';

import CreateReviewModal from './CreateReviewModal';
import EmptyAIReview from './EmptyAIReview';
import ReviewDetailModal from './ReviewDetailModal';

type TaskForReview = CompleteTask & { included: boolean };

const AIReview = ({ projectId }: { projectId: number }) => {
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
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const tasksForReview = useMemo<TaskForReview[]>(() => {
    if (!completedTasks) return [];
    return completedTasks.map((task) => ({
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

  if (isLoadingTasks || isLoadingReviews) {
    return <div className="py-10 text-center">로딩 중...</div>;
  }

  if (isErrorTasks || isErrorReviews) {
    return <div className="py-10 text-center text-red-500">에러가 발생했습니다.</div>;
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
                  <div className="flex-1 pr-4">{task.contents}</div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      task.included
                        ? 'bg-primary-300 text-neutral-600'
                        : 'bg-neutral-200 text-gray-400'
                    }`}
                  >
                    {task.status === 'DONE' ? '완료' : task.status}
                  </span>

                  <div className="w-28 text-center">{formatDate(task.startDate)}</div>
                  <div className="w-28 text-center">{formatDate(task.endDate)}</div>
                  <div className="w-25 px-2 text-center text-xs leading-snug whitespace-normal">
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

          <div className="mb-12 flex justify-center">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isLoadingTasks || isLoadingReviews || selectedTasksForAI.length === 0}
              className="h-12 w-96 rounded-md bg-orange-500 text-white disabled:bg-neutral-400"
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
          <div className="mb-3 text-2xl font-medium text-black">저장된 회고가 없어요</div>
          <div className="text-sm font-normal text-black">
            프로젝트를 완료한 뒤 회고를 작성하면 이곳에서 모아볼 수 있어요
          </div>
        </div>
      ) : (
        <div className="mb-10">
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
