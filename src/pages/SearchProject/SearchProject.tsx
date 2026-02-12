import { useState } from 'react';
import type { KeyboardEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import projectSearchImage from '@assets/image-project-search.png';

import DeleteModal from '@/components/DeleteModal';

import usePostProjectJoin from '@/hooks/SearchProject/Mutate/usePostProjectJoin';

const SearchProject = () => {
  const CODE_LENGTH = 8;
  const [code, setCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const showFailToast = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 transform';
    toast.innerHTML = `
      <div class="w-80 h-20 px-9 py-4 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-center items-center gap-2.5 shadow-lg">
        <div class="text-center justify-center text-black text-lg font-medium font-['Roboto']">입장에 실패했습니다. 코드를 확인해주세요.</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  };

  const handleChange = (value: string) => {
    const next = value.slice(0, CODE_LENGTH);
    setCode(next);
  };

  const { mutate: joinProject, isPending } = usePostProjectJoin(code);

  const isComplete = code.length === CODE_LENGTH;

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && isComplete) {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleCloseModal = () => setIsOpen(false);

  const handleSearch = () => {
    if (!isComplete) return;
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (isPending) return;
    joinProject(undefined, {
      onSuccess: (data) => {
        setIsOpen(false);
        const projectId = data?.data?.projectId ?? data?.projectId;
        if (projectId) {
          navigate(`/team/${projectId}`);
        } else {
          showFailToast();
        }
      },
      onError: () => {
        setIsOpen(false);
        showFailToast();
      },
    });
  };

  return (
    <>
      <div className="min-h-screen w-full bg-white">
        <div className="flex w-full max-w-[720px] flex-col gap-8 px-6 py-10 md:ml-10 md:px-12 md:pt-18.75">
          {/* 타이틀 */}
          <div className="text-2xl font-bold text-neutral-900 md:text-3xl">
            프로젝트에 참여해보세요!
          </div>

          {/* 이미지 */}
          <img
            className="w-full object-contain"
            src={projectSearchImage}
            alt="프로젝트 검색 플레이스홀더"
          />

          <div className="flex w-full flex-col gap-8">
            {/* 입장코드 */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium md:text-lg">입장코드</div>

              <div className="focus-within:border-primary-500 h-10 rounded-[10px] border border-gray-300 px-3 md:h-12 md:px-3.5">
                <input
                  className="h-full w-full text-sm text-neutral-900 placeholder-gray-400 outline-none focus:placeholder-transparent md:text-lg"
                  placeholder="8자리 코드를 입력해주세요"
                  value={code}
                  onChange={(e) => handleChange(e.target.value)}
                  maxLength={CODE_LENGTH}
                />
              </div>
            </div>

            {/* 버튼 */}
            <div
              className={`flex h-12 items-center justify-center rounded-[10px] text-base font-medium text-white ${
                isComplete ? 'bg-primary-500 cursor-pointer' : 'cursor-not-allowed bg-gray-300'
              }`}
              role="button"
              tabIndex={0}
              onClick={handleSearch}
              onKeyDown={handleKeyPress}
            >
              프로젝트 찾기
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title="프로젝트 참여"
        description="입장코드로 해당 프로젝트에 참여하시겠어요?"
      />
    </>
  );
};

export default SearchProject;
