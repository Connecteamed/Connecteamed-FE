// import Modal from '@/components';
import DeleteModal from '@/components/DeleteModal';
import { useState } from 'react';

const MyPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const openDeleteModal = (name: string) => {
    setSelectedItem(name);
    setIsOpen(true);
  };

  const handleDelete = () => {
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
                <th className="p-4">프로젝트명</th>
                <th className="p-4 w-30">역할</th>
                <th className="p-4 w-30">시작일</th>
                <th className="p-4 w-30">종료일</th>
                <th className="w-20 p-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-medium text-black whitespace-nowrap">
                <td className="p-4">와이어프레임 제작</td>
                <td className="p-4">기획, PPT</td>
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
                <th className="p-4">제목</th>
                <th className="p-4 w-30">만든 날짜</th>
                <th className="w-20 p-4"></th>
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
      <h2 className="mt-20 text-[24px] text-primary-500 font-bold">로그아웃</h2>

      <DeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="항목 삭제"
        description={`선택하신 "${selectedItem}" 항목을 영구적으로 삭제할까요?`}
      ></DeleteModal>
    </div>
  );
};

export default MyPage;
