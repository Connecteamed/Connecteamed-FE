import DeleteModal from '@/components/DeleteModal';

import EmptyState from './components/EmptyState';
import { useMyPage } from './hooks/useMyPage';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const MyPage = () => {
  const {
    projects,
    retros,
    isDeleteModalOpen,
    isLogoutModalOpen,
    modalDescription,
    openDeleteModal,
    closeDeleteModal,
    openLogoutModal,
    closeLogoutModal,
    handleDelete,
    handleLogout,
  } = useMyPage();

  return (
    <div className="mx-auto mt-8 flex w-full min-w-[375px] flex-col px-4 pb-24 md:mt-10 md:px-20.5 md:pb-20">
      <h1 className="text-[24px] font-bold text-black md:text-[42px]">마이페이지</h1>
      <section className="mt-[42px] mb-6 w-full md:mt-10.5 md:mb-20">
        <h2 className="text-secondary-900 text mb-6 text-[16px] font-medium md:text-[24px]">
          완료한 프로젝트
        </h2>
        {projects.length === 0 ? (
          <EmptyState
            title="완료된 프로젝트가 없어요"
            description="프로젝트를 마무리하면 이곳에서 확인할 수 있어요"
          />
        ) : (
          <div className="border-neutral-30 overflow-hidden border bg-white">
            <table className="w-full table-fixed text-left text-[12px] font-normal md:text-sm">
              <colgroup>
                <col />
                <col className="w-[58px] md:w-auto" />
                <col className="w-[74px] md:w-auto" />
                <col className="w-[74px] md:w-auto" />
                <col className="w-[44px] md:w-[80px]" />
              </colgroup>
              <thead className="border-b-neutral-30 bg-neutral-10 text-black">
                <tr>
                  <th className="p-2 whitespace-nowrap md:p-4">프로젝트명</th>
                  <th className="p-2 whitespace-nowrap md:p-4">역할</th>
                  <th className="p-2 whitespace-nowrap md:p-4">시작일</th>
                  <th className="p-2 whitespace-nowrap md:p-4">종료일</th>
                  <th className="p-2 md:p-4"></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b-neutral-30 text-[10px] text-black md:text-[14px] md:font-medium"
                  >
                    <td className="truncate p-2 md:p-4">{p.name}</td>
                    <td className="truncate p-2 md:p-4">{p.roles.join(', ')}</td>
                    <td className="p-2 whitespace-nowrap tabular-nums md:p-4">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="p-2 whitespace-nowrap tabular-nums md:p-4">
                      {formatDate(p.closedAt)}
                    </td>
                    <td
                      className="text-primary-500 cursor-pointer p-2 text-right whitespace-nowrap md:p-4"
                      onClick={() => openDeleteModal({ type: 'project', id: p.id, label: p.name })}
                    >
                      삭제
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 w-full md:mt-10.5">
        <h2 className="text-secondary-900 text mb-6 text-[16px] font-medium md:text-[24px]">
          나의 회고
        </h2>
        {retros.length === 0 ? (
          <EmptyState
            title="작성한 회고가 없어요"
            description="프로젝트를 완료한 뒤 회고를 작성하면 이곳에서 모아볼 수 있어요"
          />
        ) : (
          <div className="border-neutral-30 overflow-hidden border bg-white">
            <table className="w-full table-fixed text-left text-[12px] font-normal md:text-sm">
              <colgroup>
                <col />
                <col className="w-[88px] md:w-auto" />
                <col className="w-[44px] md:w-[80px]" />
              </colgroup>
              <thead className="border-b-neutral-30 bg-neutral-10 text-black">
                <tr>
                  <th className="p-2 whitespace-nowrap md:p-4">제목</th>
                  <th className="p-2 whitespace-nowrap md:p-4">만든 날짜</th>
                  <th className="p-2 md:p-4"></th>
                </tr>
              </thead>
              <tbody>
                {retros.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b-neutral-30 text-[10px] text-black md:text-[14px] md:font-medium"
                  >
                    <td className="truncate p-2 md:p-4">{r.title}</td>
                    <td className="p-2 whitespace-nowrap tabular-nums md:p-4">
                      {formatDate(r.createdAt)}
                    </td>
                    <td
                      className="text-primary-500 cursor-pointer p-2 text-right whitespace-nowrap md:p-4"
                      onClick={() =>
                        openDeleteModal({ type: 'retrospective', id: r.id, label: r.title })
                      }
                    >
                      삭제
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          type="button"
          className="hover:bg-primary-100 text-primary-500 mt-20 flex text-[12px] font-normal md:text-[24px] md:font-bold"
          onClick={openLogoutModal}
        >
          로그아웃
        </button>
      </section>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="항목 삭제"
        description={modalDescription}
      ></DeleteModal>

      <DeleteModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        title="로그아웃"
        description="로그아웃 하시겠습니까?"
      ></DeleteModal>
    </div>
  );
};

export default MyPage;
