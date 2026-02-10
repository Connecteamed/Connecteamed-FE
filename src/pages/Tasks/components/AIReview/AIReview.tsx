import { useMemo, useState } from 'react';

import DeleteModal from '@/components/DeleteModal';

import CreateReviewModal from './CreateReviewModal';
import EmptyAIReview from './EmptyAIReview';

interface CompletedTask {
  id: number;
  name: string;
  content: string;
  status: '완료' | '진행중' | '대기';
  startDate: string;
  dueDate: string;
  assignees: string[];
  included: boolean;
}

interface Review {
  id: number;
  title: string;
  content: string;
  achievements: string;
  createdAt: string;
}

const INITIAL_TASKS: CompletedTask[] = [
  {
    id: 1,
    name: '와이어프레임 제작',
    content: 'UI 디자인을 위한 와이어프레임 제작 후 디자이너에게 연락',
    status: '완료',
    startDate: '2025.11.13',
    dueDate: '2025.11.24',
    assignees: ['팀원1'],
    included: true,
  },
  {
    id: 2,
    name: 'API 명세서 작성',
    content: '와이어프레임 보고 서비스에 기능별 API 제작 : 스웨거로 관리할 거고 REST API 형식...',
    status: '완료',
    startDate: '2025.11.13',
    dueDate: '2025.11.30',
    assignees: ['팀원1', '팀원2', '팀원3', '팀원4'],
    included: true,
  },
  {
    id: 3,
    name: 'ERD 작성',
    content: '데이터베이스 ERD 작성',
    status: '완료',
    startDate: '2025.11.13',
    dueDate: '2025.11.30',
    assignees: ['팀원1', '팀원2'],
    included: false,
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    title: '회고임',
    content: '예시 회고 내용입니다.',
    achievements: '공모전 대상 수상, DAU 10,000달성',
    createdAt: '2025.11.30',
  },
  {
    id: 2,
    title: '회고임',
    content: '예시 회고 내용입니다.',
    achievements: '공모전 대상 수상, DAU 10,000달성',
    createdAt: '2025.11.30',
  },
];
const AIReview = () => {
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [tasks, setTasks] = useState<CompletedTask[]>(INITIAL_TASKS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const filteredTasks = useMemo(() => {
    if (!showMyTasksOnly) return tasks;
    return tasks.filter((t) => t.included);
  }, [showMyTasksOnly, tasks]);

  const handleToggleTaskInclusion = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, included: !task.included } : task)),
    );
  };

  const handleCreateFromModal = (title: string, achievements: string) => {
    setIsGenerating(true);

    const newReview: Review = {
      id: Date.now(),
      title,
      content: 'AI가 생성한 회고 내용',
      achievements,
      createdAt: '',
    };

    setReviews((prev) => [...prev, newReview]);
    setIsGenerating(false);
    setIsCreateModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId === null) return;
    setReviews((prev) => prev.filter((r) => r.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  if (tasks.length === 0 && reviews.length === 0) {
    return <EmptyAIReview />;
  }

  return (
    <div className="w-full">
      {/* ================= 업무 영역 ================= */}
      {tasks.length > 0 && (
        <>
          {/* 내 업무만 보기 */}
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

          {/* 업무 테이블 */}
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
                  key={task.id}
                  className={`border-neutral-30 flex items-center border-b px-5 py-3 text-xs last:border-b-0 ${
                    task.included ? 'text-neutral-90' : 'text-neutral-60'
                  }`}
                >
                  <div className="line-clamp-2 w-28 pr-4 text-xs leading-snug font-medium">
                    {task.name}
                  </div>
                  <div className="flex-1 pr-4">{task.content}</div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      task.included
                        ? 'bg-primary-300 text-neutral-600'
                        : 'bg-neutral-200 text-gray-400'
                    }`}
                  >
                    {task.status}
                  </span>

                  <div className="w-28 text-center">{task.startDate}</div>
                  <div className="w-28 text-center">{task.dueDate}</div>
                  <div className="w-25 px-2 text-center text-xs leading-snug whitespace-normal">
                    {task.assignees.join(', ')}
                  </div>

                  <div className="w-8 text-center">
                    <button
                      onClick={() => handleToggleTaskInclusion(task.id)}
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

          {/* AI 회고 생성 버튼 */}
          <div className="mb-12 flex justify-center">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isGenerating}
              className="h-12 w-96 rounded-md bg-orange-500 text-white"
            >
              AI로 프로젝트 회고하기
            </button>
          </div>
        </>
      )}

      {/* ================= 회고 영역 ================= */}
      <div className="text-secondary-900 mb-4 text-2xl font-medium">회고 목록</div>
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-3 text-2xl font-medium text-black">저장된 회고가 없어요</div>
          <div className="text-sm font-normal text-black">
            프로젝트를 완료한 뒤 회고를 작성하면 이곳에서 모아볼 수 있어요
          </div>
        </div>
      ) : (
        <div className="mb-10">
          {/* 회고 테이블 헤더 */}
          <div className="bg-neutral-10 border-neutral-30 flex h-12 items-center border px-5 text-sm font-medium">
            <div className="flex-1">제목</div>
            <div className="w-40 text-center">만든 날짜</div>
            <div className="w-16" />
          </div>

          {/* 회고 테이블 바디 */}
          <div className="border-neutral-30 border-x border-b">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-neutral-30 flex items-center border-b px-5 py-3 text-xs last:border-b-0"
              >
                <div className="line-clamp-1 flex-1 font-medium">{review.title}</div>

                <div className="w-40 text-center">{review.createdAt || '-'}</div>

                <div className="w-16 text-center">
                  <button
                    onClick={() => setDeleteTargetId(review.id)}
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

      {/* 모달 */}
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
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateFromModal}
        />
      )}
    </div>
  );
};

export default AIReview;
