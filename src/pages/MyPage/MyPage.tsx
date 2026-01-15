import Modal from '@/components';
import { useState } from 'react';

const MyPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const openDeleteModal = (name: string) => {
    setSelectedItem(name);
    setIsOpen(true);
  };

  const handleDelete = () => {
    console.log(`${selectedItem} 삭제됨`);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col justify-center mt-10 px-20.5">
      <h1 className="text-[42px] font-bold text-black">마이페이지</h1>
      <section className="w-full mt-10.5 mb-20">
        <h2 className="mb-6 font-medium text-[24px] text-secondary-900">완료한 프로젝트</h2>
        <div className="overflow-hidden border border-neutral-30">
          <table className="w-full text-sm text-left bg-white">
            <thead className="text-black border-b-neutral-30 bg-neutral-10">
              <tr className="whitespace-nowrap">
                <th className="w-1/2 p-4">프로젝트명</th>
                <th className="p-4">역할</th>
                <th className="p-4">시작일</th>
                <th className="p-4">종료일</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-medium text-black whitespace-nowrap">
                <td className="p-4">와이어프레임 제작</td>
                <td className="p-4 ">기획, PPT</td>
                <td className="p-4">2025.11.13</td>
                <td className="p-4">2025.11.24</td>
                <td
                  className="p-4 text-right cursor-pointer text-primary-500"
                  onClick={() => openDeleteModal('와이어프레임 제작')}
                >
                  삭제
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="w-full mt-10.5">
        <h2 className="mb-6 font-medium text-[24px] text-secondary-900">나의 회고</h2>
        <div className="overflow-hidden border border-neutral-30">
          <table className="w-full text-sm text-left bg-white">
            <thead className="text-black border-b-neutral-30 bg-neutral-10">
              <tr className="whitespace-nowrap">
                <th className="w-4/5 p-4">제목</th>
                <th className="p-4">만든 날짜</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-medium text-black whitespace-nowrap border-b-neutral-30">
                <td className="p-4">회고1</td>
                <td className="p-4">2025.11.30</td>
                <td
                  className="p-4 text-right cursor-pointer text-primary-500"
                  onClick={() => openDeleteModal('회고1')}
                >
                  삭제
                </td>
              </tr>
              <tr className="font-medium text-black whitespace-nowrap border-b-neutral-30">
                <td className="p-4">회고2</td>
                <td className="p-4">2025.11.30</td>
                <td
                  className="p-4 text-right cursor-pointer text-primary-500"
                  onClick={() => openDeleteModal('회고2')}
                >
                  삭제
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/* 모달 내부 디자인 */}
        <div className="bg-white rounded-[20px] px-10 py-8 flex flex-col items-center min-w-[360px] shadow-xl">
          <h2 className="text-[20px] font-bold text-black mb-4">정말 삭제하시겠습니까?</h2>
          <p className="text-neutral-500 mb-8 text-center text-[16px]">
            선택하신 <span className="font-semibold text-black">"{selectedItem}"</span> 항목이
            <br />
            영구적으로 삭제됩니다.
          </p>

          <div className="flex w-full gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 font-medium rounded-lg bg-neutral-10 text-neutral-600 hover:bg-neutral-20"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 font-medium text-white rounded-lg bg-primary-500 hover:bg-primary-600"
            >
              삭제하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPage;
