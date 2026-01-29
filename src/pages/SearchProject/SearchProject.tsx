import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import Modal from '@/components/Modal';
import SearchCheckModal from './components/SearchCheckModal';
import projectSearchImage from '@assets/image-project-search.png'

const SearchProject = () => {
  const CODE_LENGTH = 6;
  const [code, setCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value: string) => {
    const next = value.slice(0, CODE_LENGTH);
    setCode(next);
  };

  const isComplete = code.length === CODE_LENGTH;

  const handleOpenModal = () => {
    if (!isComplete) return;
    setIsOpen(true);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && isComplete) {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
    <div className="w-full h-full bg-white">
      <div className="inline-flex w-113.25 flex-col items-start justify-start gap-8 pl-20.5 pt-18.75">
        <div className="h-16 justify-center self-stretch text-3xl font-bold text-black">
          프로젝트에 참여해보세요!
        </div>
        <div className="flex w-96 flex-col items-start justify-start gap-16">
          <img
            className="h-72 w-full"
            src={projectSearchImage}
            alt="프로젝트 검색 플레이스홀더"
          />
          <div className="flex flex-col items-start justify-start gap-10 self-stretch">
            <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
              <div className="flex flex-col items-end justify-start gap-1.5 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
                  <div className="h-7 justify-center self-stretch text-lg text-black">
                    입장코드
                  </div>
                  <div className="inline-flex h-12 items-center justify-start gap-2.5 self-stretch rounded-[10px] bg-white px-3.5 py-1.5 outline-1 -outline-offset-1 outline-gray-300">
                    <input
                      className="w-full justify-center text-lg text-gray-300 outline-none"
                      placeholder="6자리 코드를 입력해주세요"
                      value={code}
                      onChange={(e) => handleChange(e.target.value)}
                      maxLength={CODE_LENGTH}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`inline-flex h-12 items-center justify-center self-stretch rounded-[10px] px-3 py-4 ${isComplete ? 'bg-orange-500' : 'bg-gray-300'} ${isComplete ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              role="button"
              tabIndex={0}
              onClick={handleOpenModal}
              onKeyDown={handleKeyPress}
            >
              <div className="flex items-center justify-center gap-2.5 px-4">
                <div className="justify-start text-base leading-4 tracking-wide text-white">
                  프로젝트 찾기
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {isOpen && (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <SearchCheckModal />
    </Modal>
    )}
    </>
  );
};

export default SearchProject;
