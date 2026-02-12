import { useState } from 'react';
import usePatchTaskDetail from '@/hooks/TaskPage/Mutate/usePatchTaskDetail';

import type { TaskStatusApi } from '@/types/TaskManagement/task';

const statusStyle: Record<TaskStatusApi, string> = {
  NOT_STARTED: 'bg-zinc-200 text-neutral-600',
  IN_PROGRESS: 'bg-orange-100 text-neutral-600',
  DONE: 'bg-orange-300 text-neutral-700',
};

const statusLabel: Record<TaskStatusApi, string> = {
  NOT_STARTED: '시작 전',
  IN_PROGRESS: '진행 중',
  DONE: '완료',
};

const formatDate = (value?: string) => {
  if (!value) return '';
  return value.includes('T') ? value.slice(0, 10) : value.replaceAll('-', '.');
};

type Props = {
  taskId: string;
  title: string;
  status: TaskStatusApi;
  assignees: string;
  assigneeIds?: number[];
  startDate: string;
  endDate: string;
  content?: string;
  myNote?: string;
  onEdit?: () => void;
  editable?: boolean;
  onSuccessEdit?: () => void;
};

const TaskDetailModal = ({
  taskId,
  title,
  status,
  assignees,
  assigneeIds = [],
  startDate,
  endDate,
  content: initialContent,
  myNote: initialMyNote,
  onEdit,
  editable,
  onSuccessEdit,
}: Props) => {
  const { mutate: patchTask, isPending } = usePatchTaskDetail(Number(taskId));
  const [content, setContent] = useState(initialContent || '');
  const [myNote, setMyNote] = useState(initialMyNote || '');
  const isEditable = editable;

  if (!isEditable) {
    return (
      <div className="relative flex h-[550px] w-full max-w-[650px] items-center justify-start gap-2.5 rounded-[20px] bg-white px-4 py-6 md:px-11 md:py-10">
        <div className="inline-flex w-full max-w-[560px] flex-col items-start justify-start gap-3">
          <div className="h-12 w-full truncate text-3xl font-bold text-black" title={title}>
            {title}
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-1">
            <div className="flex w-full flex-col items-start justify-start gap-6">
              <div className="flex w-48 flex-col items-start justify-start gap-6">
                <div className="inline-flex items-center justify-start gap-12">
                  <div className="text-lg font-medium text-black">상태</div>
                  <div
                    className={`flex h-7 w-20 items-center justify-center gap-2.5 rounded-[20px] px-3.5 py-1.5 ${statusStyle[status]}`}
                  >
                    <div className="text-center text-xs font-medium text-neutral-600">{statusLabel[status]}</div>
                  </div>
                </div>
                <div className="inline-flex w-full items-center justify-start gap-7">
                  <div className="text-lg font-medium text-black">담당자</div>
                  <div className="text-sm font-normal text-black">{assignees || '-'}</div>
                </div>
                <div className="inline-flex items-center justify-start gap-7">
                  <div className="text-lg font-medium text-black">시작일</div>
                  <div className="text-sm font-normal text-black">
                    {formatDate(startDate) || '-'}
                  </div>
                </div>
                <div className="inline-flex items-center justify-start gap-7">
                  <div className="text-lg font-medium text-black">마감일</div>
                  <div className="text-sm font-normal text-black">{formatDate(endDate) || '-'}</div>
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-start gap-3">
                <div className="flex w-full flex-col items-start justify-start gap-2">
                  <div className="h-9 w-full text-lg font-medium text-black">업무내용</div>
                  <div className="inline-flex h-20 w-full items-center gap-2.5 rounded-[10px] bg-white px-2 py-2 md:px-4 md:py-4 outline outline-1 outline-gray-300">
                    <div className="h-12 flex-1 text-sm font-normal text-black">
                      {initialContent || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex h-14 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-[5px] bg-gray-300 px-4 py-4 md:px-24 text-lg font-medium text-white opacity-70"
            disabled
          >
            수정하기
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative flex h-[750px] w-full max-w-[650px] items-center justify-start gap-2.5 rounded-[20px] bg-white px-4 py-6 md:px-11 md:py-10">
        <div className="inline-flex w-full max-w-[560px] flex-col items-start justify-start gap-3">
          <div
            className="h-12 w-full truncate text-3xl font-bold text-black"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={title}
          >
            {title}
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-1">
            <div className="flex w-full flex-col items-start justify-start gap-6">
              <div className="flex w-48 flex-col items-start justify-start gap-6">
                <div className="inline-flex items-center justify-start gap-12">
                  <div className="text-lg font-medium text-black">상태</div>
                  <div
                    className={`flex h-7 w-20 items-center justify-center gap-2.5 rounded-[20px] px-3.5 py-1.5 ${statusStyle[status]}`}
                  >
                    <div className="text-center text-xs font-medium text-neutral-600">{status}</div>
                  </div>
                </div>
                <div className="inline-flex w-full items-center justify-start gap-7">
                  <div className="text-lg font-medium text-black">담당자</div>
                  <div className="text-sm font-normal text-black">{assignees || '-'}</div>
                </div>
                <div className="inline-flex items-center justify-start gap-7">
                  <div className="text-lg font-medium text-black">시작일</div>
                  <div className="text-sm font-normal text-black">
                    {formatDate(startDate) || '-'}
                  </div>
                </div>
                <div className="inline-flex items-center justify-start gap-7">
                  <div className="text-lg font-medium text-black">마감일</div>
                  <div className="text-sm font-normal text-black">{formatDate(endDate) || '-'}</div>
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-start gap-3">
                <div className="flex w-full flex-col items-start justify-start gap-2">
                  <div className="h-9 w-full text-lg font-medium text-black">업무내용</div>
                  <div className="inline-flex h-20 w-full items-center gap-2.5 rounded-[10px] bg-white px-2 py-2 md:px-4 md:py-4 outline outline-1 outline-gray-300">
                    <textarea
                      className="h-12 flex-1 resize-none bg-transparent text-sm font-normal text-black focus:outline-none w-full"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      style={{
                        minHeight: '48px',
                        maxHeight: '48px',
                        overflowY: 'auto',
                        padding: 0,
                        margin: 0,
                      }}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col items-start justify-start">
                  <div className="h-9 w-full text-lg font-medium text-black">내 성과 및 느낀점</div>
                  <div className="inline-flex h-32 w-full items-center gap-2.5 rounded-[10px] bg-white px-2 py-2 md:px-4 md:py-4 outline outline-1 outline-gray-300">
                    <textarea
                      className="h-24 flex-1 resize-none bg-transparent text-sm font-normal text-gray-400 focus:outline-none w-full"
                      value={myNote}
                      onChange={(e) => setMyNote(e.target.value)}
                      placeholder="이번 업무에서 특별히 신경 쓴 부분, 해결한 문제, 혹은 아쉬웠던 점을 자유롭게 적어주세요. (예: API 속도 이슈 해결, 디자인 팀과의 소통 원활 등)"
                      style={{
                        minHeight: '96px',
                        maxHeight: '96px',
                        overflowY: 'auto',
                        padding: 0,
                        margin: 0,
                      }}
                    />
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
            className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-[5px] ${isPending ? 'bg-gray-300' : 'bg-orange-500'} px-4 py-4 md:px-24 text-lg font-medium text-white`}
            onClick={() => {
              let safeAssigneeIds: number[] = [];
              if (Array.isArray(assigneeIds)) {
                safeAssigneeIds = assigneeIds.filter((id) => typeof id === 'number' && !isNaN(id));
              } else if (typeof assigneeIds === 'number' && !isNaN(assigneeIds)) {
                safeAssigneeIds = [assigneeIds];
              }
              // 날짜를 점(.) 구분 형식으로 변환
              const toDotDate = (date?: string) => {
                if (!date) return '';
                if (date.includes('.')) return date;
                if (date.includes('T')) return date.slice(0, 10).replaceAll('-', '.');
                return date.replaceAll('-', '.');
              };
              patchTask({
                title,
                status,
                assigneeIds: safeAssigneeIds,
                startDate: toDotDate(startDate) || '',
                endDate: toDotDate(endDate) || '',
                contents: content,
                noteContent: myNote,
              }, {
                onSuccess: () => {
                  if (onSuccessEdit) onSuccessEdit();
                },
              });
            }}
            disabled={isPending}
          >
            {isPending ? '저장 중...' : '수정하기'}
          </button>
        </div>
      </div>
    );
  }
};

export default TaskDetailModal;
