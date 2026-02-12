import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import Modal from '@/components/Modal';
import SearchCheckModal from './components/SearchCheckModal';
import projectSearchImage from '@assets/image-project-search.png';
import usePostProjectJoin from '@/hooks/SearchProject/Mutate/usePostProjectJoin';

const SearchProject = () => {
  const CODE_LENGTH = 8;
  const [code, setCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
      onSuccess: () => setIsOpen(false),
    });
  };

  return (
    <>
      <div className="w-full h-full bg-white">
        <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-6 md:max-w-none md:px-0 md:py-0 md:pt-18.75 md:pl-20.5">
          
          {/* 타이틀 */}
          <div className="text-center text-xl font-bold md:text-left md:text-3xl">
            프로젝트에 참여해보세요!
          </div>

          {/* 이미지 */}
          <img
            className="mx-auto w-full max-w-xs md:mx-0 md:h-72 md:w-96"
            src={projectSearchImage}
            alt="프로젝트 검색 플레이스홀더"
          />

          <div className="flex flex-col gap-10 md:w-96">
            
            {/* 입장코드 */}
            <div className="flex flex-col gap-1.5">
              <div className="text-sm font-medium md:text-lg">
                입장코드
              </div>

              <div className="h-10 rounded-[10px] border border-gray-300 px-3 md:h-12 md:px-3.5">
                <input
                  className="h-full w-full text-xs outline-none md:text-lg"
                  placeholder="8자리 코드를 입력해주세요"
                  value={code}
                  onChange={(e) => handleChange(e.target.value)}
                  maxLength={CODE_LENGTH}
                />
              </div>
            </div>

            {/* 버튼 */}
            <div
              className={`h-12 rounded-[10px] text-white flex items-center justify-center ${
                isComplete
                  ? 'bg-orange-500 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
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

      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <SearchCheckModal
            onConfirm={handleConfirm}
            onCancel={handleCloseModal}
            isLoading={isPending}
          />
        </Modal>
      )}
    </>
  );
};

export default SearchProject;
