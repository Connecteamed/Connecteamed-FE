import { useState } from 'react';

import type { CompleteTask } from '@/types/TaskManagement/taskComplete';
import type { RetrospectiveDetailData } from '@/types/retrospective';

import Modal from '@/components/Modal';

import deleteIcon from '@/assets/icon-delete.svg';

import { usePatchRetrospective } from '@/hooks/TaskPage/Mutate/usePatchRetrospective';
import { usePostAIRetrospective } from '@/hooks/TaskPage/Mutate/usePostAIRetrospective';
import { useGetRetrospectiveDetail } from '@/hooks/TaskPage/Query/useGetRetrospectiveDetail';

type TaskForReview = CompleteTask & { included: boolean };

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  selectedTasks: TaskForReview[];
  projectId: number;
}

const WAITING_PLACEHOLDER = 'AI 분석이 진행 중입니다. 잠시만 기다려 주세요.';

const CreateReviewModal = ({
  isOpen,
  onClose,
  onCreate,
  selectedTasks,
  projectId,
}: CreateReviewModalProps) => {
  const [title, setTitle] = useState('');
  const [achievements, setAchievements] = useState('');
  const [createdRetrospectiveId, setCreatedRetrospectiveId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResultState, setEditedResultState] = useState('');

  const { mutate: createAIRetro, isPending: isCreatingAIRetro } = usePostAIRetrospective({
    projectId,
  });

  const { mutate: patchRetro, isPending: isSaving } = usePatchRetrospective({ projectId });

  const {
    data: fetchedRetrospectiveDetail,
    isFetching: isFetchingDetail,
    isError: isErrorDetail,
  } = useGetRetrospectiveDetail(
    projectId,
    createdRetrospectiveId,
    createdRetrospectiveId !== null,
    {
      refetchInterval: (query) => {
        const data = query.state.data;
        if (data?.projectResult === WAITING_PLACEHOLDER) {
          return 3000;
        }
        return false;
      },
    },
  );

  if (isErrorDetail) {
    alert('회고 결과를 불러오는데 실패했습니다.');
    return null;
  }

  const detailedResult: RetrospectiveDetailData | null =
    fetchedRetrospectiveDetail?.projectResult === WAITING_PLACEHOLDER
      ? null
      : (fetchedRetrospectiveDetail ?? null);

  const isFetchingResult =
    createdRetrospectiveId !== null &&
    (!detailedResult || detailedResult.projectResult === WAITING_PLACEHOLDER || isFetchingDetail);

  const isLoading = isCreatingAIRetro || isFetchingResult;

  const selectedTaskCount = selectedTasks.filter((task) => task.included).length;

  const isCreateDisabled = isLoading || selectedTaskCount === 0;

  const displayedResult = isEditing ? editedResultState : (detailedResult?.projectResult ?? '');

  const handleCreate = () => {
    if (!title.trim() || !achievements.trim()) {
      alert('제목과 프로젝트 성과를 모두 입력해주세요.');
      return;
    }

    const taskIds = selectedTasks.filter((task) => task.included).map((task) => task.taskId);

    createAIRetro(
      {
        title,
        projectResult: achievements,
        taskIds,
      },
      {
        onSuccess: (postResponse) => {
          const responseData = postResponse?.data as
            | { retrospectiveId?: number; id?: number }
            | undefined;

          const newId = responseData?.retrospectiveId ?? responseData?.id;

          if (!newId) {
            alert('회고 생성에는 성공했으나 ID를 찾을 수 없습니다.');
            return;
          }

          setCreatedRetrospectiveId(newId);
          onCreate();
        },
      },
    );
  };

  const handleSave = () => {
    if (!createdRetrospectiveId) return;

    patchRetro(
      {
        retrospectiveId: createdRetrospectiveId,
        body: {
          title: detailedResult?.title || title,
          projectResult: editedResultState,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert('회고가 저장되었습니다.');
        },
        onError: () => {
          alert('저장에 실패했습니다.');
        },
      },
    );
  };

  const handleClose = () => {
    setTitle('');
    setAchievements('');
    setCreatedRetrospectiveId(null);
    setIsEditing(false);
    setEditedResultState('');
    onClose();
  };

  if (detailedResult) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div
          className="w-162.5 rounded-[20px] bg-white px-11 py-12"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold">AI 회고 생성 완료</h2>
            <button onClick={handleClose}>
              <img src={deleteIcon} alt="close" className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-lg font-medium">회고 결과</label>

              {!isEditing ? (
                <button
                  onClick={() => {
                    setEditedResultState(detailedResult.projectResult ?? '');
                    setIsEditing(true);
                  }}
                  className="text-primary-500 text-sm font-medium"
                >
                  수정하기
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-primary-500 text-sm font-medium"
                >
                  {isSaving ? '저장 중...' : '저장하기'}
                </button>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={displayedResult}
                onChange={(e) => setEditedResultState(e.target.value)}
                rows={10}
                className="w-full resize-none rounded-md bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <div className="flex max-h-80 min-h-30 w-full items-start overflow-y-auto rounded-md bg-slate-100 px-4 py-3 text-left text-sm whitespace-pre-wrap">
                {displayedResult}
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className="w-full rounded-[5px] bg-orange-500 px-6 py-4 text-lg font-medium text-white"
          >
            확인
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="w-162.5 rounded-[20px] bg-white px-11 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">AI 회고 생성</h2>
          <button onClick={onClose}>
            <img src={deleteIcon} alt="close" className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-lg font-medium">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="h-12 w-full bg-slate-100 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-lg font-medium">프로젝트 성과</label>
          <textarea
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            disabled={isLoading}
            rows={10}
            className="w-full resize-none bg-slate-100 px-4 py-3 text-sm outline-none"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={isCreateDisabled}
          className="w-full rounded-[5px] bg-orange-500 px-6 py-4 text-lg font-medium text-white disabled:bg-neutral-50 disabled:text-neutral-400"
        >
          {isLoading
            ? 'AI가 회고를 생성하고 있습니다... (최대 1-2분 소요)'
            : selectedTaskCount === 0
              ? '업무를 선택해주세요'
              : '생성하기'}
        </button>
      </div>
    </Modal>
  );
};

export default CreateReviewModal;
