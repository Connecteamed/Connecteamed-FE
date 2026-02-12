import { useState } from 'react';

import Modal from '@/components/Modal';

import deleteIcon from '@/assets/icon-delete.svg';

import { usePatchRetrospective } from '@/hooks/TaskPage/Mutate/usePatchRetrospective';
import { useGetRetrospectiveDetail } from '@/hooks/TaskPage/Query/useGetRetrospectiveDetail';

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  retrospectiveId: number;
}

const ReviewDetailModal = ({
  isOpen,
  onClose,
  projectId,
  retrospectiveId,
}: ReviewDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedResult, setEditedResult] = useState('');

  const {
    data: detail,
    isLoading,
    isError,
  } = useGetRetrospectiveDetail(projectId, retrospectiveId, isOpen);

  const { mutate: patchRetro, isPending: isSaving } = usePatchRetrospective({ projectId });

  const handleEditStart = () => {
    if (!detail) return;
    setEditedTitle(detail.title);
    setEditedResult(detail.projectResult);
    setIsEditing(true);
  };

  const handleSave = () => {
    patchRetro(
      {
        retrospectiveId,
        body: {
          title: editedTitle,
          projectResult: editedResult,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert('회고가 수정되었습니다.');
        },
        onError: () => {
          alert('수정에 실패했습니다.');
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-130 overflow-y-auto rounded-[20px] bg-white px-5 py-6 md:max-w-162.5 md:px-11 md:py-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">회고 상세 보기</h2>
          <button onClick={onClose}>
            <img src={deleteIcon} alt="close" className="h-6 w-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">로딩 중...</div>
        ) : isError || !detail ? (
          <div className="py-20 text-center text-red-500">정보를 불러오지 못했습니다.</div>
        ) : (
          <>
            <div className="mb-6">
              <label className="mb-3 block text-lg font-medium">제목</label>

              {isEditing ? (
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="h-12 w-full bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <div className="flex h-12 w-full items-center rounded-md bg-slate-100 px-4 py-3 text-sm">
                  {detail.title}
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-lg font-medium">회고 결과</label>

                {!isEditing ? (
                  <button onClick={handleEditStart} className="text-sm font-medium text-orange-500">
                    수정하기
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="text-sm font-medium text-orange-500"
                  >
                    {isSaving ? '저장 중...' : '저장하기'}
                  </button>
                )}
              </div>

              {isEditing ? (
                <textarea
                  value={editedResult}
                  onChange={(e) => setEditedResult(e.target.value)}
                  rows={10}
                  className="w-full resize-none rounded-md bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <div className="flex max-h-[60vh] min-h-40 w-full items-start overflow-y-auto rounded-md bg-slate-100 px-4 py-3 text-left text-sm whitespace-pre-wrap">
                  {detail.projectResult}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-[5px] bg-orange-500 px-6 py-4 text-lg font-medium text-white"
            >
              확인
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ReviewDetailModal;
