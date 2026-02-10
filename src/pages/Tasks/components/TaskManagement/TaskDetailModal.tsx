import type { TaskStatusLabel } from '@/types/TaskManagement/task';

const statusStyle: Record<TaskStatusLabel, string> = {
  '시작 전': 'bg-zinc-200 text-neutral-600',
  '진행 중': 'bg-orange-100 text-neutral-600',
  '완료': 'bg-orange-300 text-neutral-700',
};

const formatDate = (value?: string) => {
  if (!value) return '';
  return value.includes('T') ? value.slice(0, 10) : value.replaceAll('-', '.');
};

type Props = {
  title: string;
  status: TaskStatusLabel;
  assignees: string;
  startDate?: string;
  endDate?: string;
  content?: string;
  myNote?: string;
  onEdit?: () => void;
};

const TaskDetailModal = ({
  title,
  status,
  assignees,
  startDate,
  endDate,
  content,
  myNote,
  onEdit,
}: Props) => {
  return (
    <div className="relative flex h-[750px] w-[650px] items-center justify-start gap-2.5 rounded-[20px] bg-white px-11 py-10">
      <div className="inline-flex w-[560px] flex-col items-start justify-start gap-3">
        <div className="h-12 w-full text-3xl font-bold text-black">{title}</div>

        <div className="flex w-full flex-col items-start justify-start gap-1">
          <div className="flex w-full flex-col items-start justify-start gap-6">
            <div className="flex w-48 flex-col items-start justify-start gap-6">
              <div className="inline-flex items-center justify-start gap-12">
                <div className="text-lg font-medium text-black">상태</div>
                <div className={`flex h-7 w-20 items-center justify-center gap-2.5 rounded-[20px] px-3.5 py-1.5 ${statusStyle[status]}`}>
                  <div className="text-center text-xs font-medium text-neutral-600">{status}</div>
                </div>
              </div>
              <div className="inline-flex w-full items-center justify-start gap-7">
                <div className="text-lg font-medium text-black">담당자</div>
                <div className="text-sm font-normal text-black">{assignees || '-'}</div>
              </div>
              <div className="inline-flex items-center justify-start gap-7">
                <div className="text-lg font-medium text-black">시작일</div>
                <div className="text-sm font-normal text-black">{formatDate(startDate) || '-'}</div>
              </div>
              <div className="inline-flex items-center justify-start gap-7">
                <div className="text-lg font-medium text-black">마감일</div>
                <div className="text-sm font-normal text-black">{formatDate(endDate) || '-'}</div>
              </div>
            </div>

            <div className="flex w-full flex-col items-start justify-start gap-3">
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <div className="h-9 w-full text-lg font-medium text-black">업무내용</div>
                <div className="inline-flex h-20 w-full items-center gap-2.5 rounded-[10px] bg-white px-4 py-4 outline outline-1 outline-gray-300">
                  <div className="h-12 flex-1 text-sm font-normal text-black">
                    {content || '내용이 없습니다.'}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-start">
                <div className="h-9 w-full text-lg font-medium text-black">내 성과 및 느낀점</div>
                <div className="inline-flex h-32 w-full items-center gap-2.5 rounded-[10px] bg-white px-4 py-4 outline outline-1 outline-gray-300">
                  <div className="h-24 flex-1 text-sm font-normal text-gray-400">
                    {myNote || '이번 업무에서 특별히 신경 쓴 부분, 해결한 문제, 혹은 아쉬웠던 점을 자유롭게 적어주세요. (예: API 속도 이슈 해결, 디자인 팀과의 소통 원활 등)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-7 w-full text-xs font-medium text-black">
            해당 내용은 나에게만 보이고 최종 회고에 쓰일 내용이에요
          </div>
        </div>

        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[5px] bg-gray-300 px-24 py-4 text-lg font-medium text-white"
          onClick={onEdit}
          disabled={!onEdit}
        >
          수정하기
        </button>
      </div>
    </div>
  );
};

export default TaskDetailModal;
