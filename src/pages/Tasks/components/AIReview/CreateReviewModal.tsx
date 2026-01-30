import { useState } from 'react';

import Modal from '@/components/Modal';

import deleteIcon from '@/assets/icon-delete.svg';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, achievements: string) => void;
}

const CreateReviewModal = ({ isOpen, onClose, onCreate }: CreateReviewModalProps) => {
  const [title, setTitle] = useState('');
  const [achievements, setAchievements] = useState('');

  const handleCreate = () => {
    if (title.trim() && achievements.trim()) {
      onCreate(title, achievements);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="w-[650px] rounded-[20px] bg-white px-11 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex min-w-0 items-end gap-5">
            <h2 className="shrink-0 text-3xl leading-none font-bold">AI 회고 생성</h2>
            <p className="min-w-0 text-xs leading-none font-medium text-neutral-900">
              내가 완료한 업무에 작성된 내용을 기반으로 생성됩니다
            </p>
          </div>
          <button onClick={onClose}>
            <img src={deleteIcon} alt="close" className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-lg font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full bg-slate-100 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-lg font-medium">프로젝트 성과</label>
          <textarea
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            rows={10}
            className="w-full resize-none bg-slate-100 px-4 py-3 text-sm font-normal outline-none"
          />
        </div>

        <button
          onClick={handleCreate}
          className="w-full rounded-[5px] bg-orange-500 px-6 py-4 text-lg font-medium text-white disabled:bg-neutral-50"
        >
          생성하기
        </button>
      </div>
    </Modal>
  );
};

export default CreateReviewModal;
