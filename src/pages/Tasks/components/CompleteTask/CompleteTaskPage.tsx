
import { useMemo, useState, useEffect } from 'react';
import useGetCompletedTasks from '@/hooks/TaskPage/Query/useGetCompletedTasks';
import type { TaskStatusApi, TaskStatusLabel } from '@/types/TaskManagement/taskList';

const statusStyle: Record<TaskStatusLabel, string> = {
  '시작 전': 'bg-zinc-200 text-neutral-600',
  '진행 중': 'bg-orange-100 text-neutral-600',
  완료: 'bg-orange-300 text-neutral-700',
};

const statusLabelByApi: Record<TaskStatusApi, TaskStatusLabel> = {
  NOT_STARTED: '시작 전',
  IN_PROGRESS: '진행 중',
  DONE: '완료',
};

const normalizeDateInput = (value?: string | null) => {
  if (!value) return '';
  if (value.includes('T')) return value.slice(0, 10);
  return value.replaceAll('.', '-').replaceAll('-', '.');
};

const formatAssignees = (assignees?: { memberName?: string }[]) => {
  if (!Array.isArray(assignees)) return '';
  return assignees.map((a) => a?.memberName).filter(Boolean).join(', ');
};

type Props = {
  projectId: number;
};

type TaskRow = {
  id: string;
  title: string;
  description: string;
  status: TaskStatusLabel;
  startDate: string;
  endDate: string;
  assignees: string;
  assigneeIds: number[];
};


const CompleteTaskPage = ({ projectId }: Props) => {
  const { data: completedTasks = [] } = useGetCompletedTasks(projectId);
  const [taskList, setTaskList] = useState<TaskRow[]>([]);

  useEffect(() => {
    if (!completedTasks) return;
    const mapped: TaskRow[] = completedTasks.map((task: any) => ({
      id: task.taskId ?? crypto.randomUUID(),
      title: task.name ?? '제목 없음',
      description: task.content ?? '',
      status: statusLabelByApi[task.status] ?? '완료',
      startDate: normalizeDateInput(task.startDate),
      endDate: normalizeDateInput(task.dueDate),
      assignees: Array.isArray(task.assignees)
        ? task.assignees.map((a: any) => a.memberName).filter(Boolean).join(', ')
        : '',
      assigneeIds: Array.isArray(task.assignees)
        ? task.assignees.map((a: any) => a.projectMemberId).filter((id: number) => typeof id === 'number' && Number.isFinite(id))
        : [],
    }));
    setTaskList(mapped);
  }, [completedTasks]);

  if (!taskList.length) {
    return (
      <div className="flex py-25 gap-4 w-full flex-col items-center justify-center max-[767px]:min-h-screen max-[767px]:py-10">
        <div className="inline-flex w-48 flex-col items-center justify-start gap-4 max-[767px]:hidden">
          <div className="inline-flex h-48 items-center justify-center gap-2.5 self-stretch rounded-[100px] bg-orange-100 p-8">
            <div className="relative h-32 w-32 overflow-hidden">
              <img src="/assets/search-paper.svg" alt="search paper" />
            </div>
          </div>
          <div className="flex w-80 flex-col items-center gap-3 justify-start">
            <div className="h-[28px] justify-center self-stretch text-center text-2xl font-medium text-black">
              아직 완료된 업무가 없어요
            </div>
            <div className="h-[40px] justify-center items-center self-stretch text-center font-normal text-black">
              완료된 업무가 이곳에 표시됩니다
            </div>
          </div>
        </div>
        <div className="hidden w-full flex-col items-center justify-center gap-4 py-10 max-[767px]:inline-flex">
          <div className="inline-flex w-48 flex-col items-center justify-start gap-4">
            <div className="inline-flex h-24 w-24 items-center justify-center gap-2.5 rounded-[100px] bg-orange-100 p-8">
              <div className="relative h-20 w-20 overflow-hidden">
                <img src="/assets/search-paper.svg" alt="search paper" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex w-80 flex-col items-center justify-start gap-1.5">
              <div className="h-7 self-stretch text-center text-sm font-medium text-black">
                아직 완료된 업무가 없어요
              </div>
              <div className="h-10 self-stretch text-center text-[10px] font-normal text-black">
                완료된 업무가 이곳에 표시됩니다
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex w-full flex-col items-start justify-start">
      <div className="flex h-12 flex-col justify-center self-stretch bg-slate-100 p-3.5 outline-gray-200 max-[767px]:hidden">
        <div className="inline-flex items-center gap-0 w-full">
          <div className="flex items-center gap-0">
            <div className="h-5 w-40 text-sm text-black">업무명</div>
            <div className="hidden h-5 w-64 text-sm text-black min-[1440px]:block">업무내용</div>
          </div>
          <div className="flex items-center gap-0">
            <div className="h-5 w-24 text-center text-sm text-black">상태</div>
            <div className="flex h-5 items-center gap-0">
              <div className="h-5 w-28 text-sm text-black max-[1120px]:hidden">시작일</div>
              <div className="h-5 w-28 text-sm text-black max-[1000px]:hidden">마감일</div>
              <div className="h-5 w-32 text-sm text-black max-[890px]:hidden">담당자</div>
              <div className="h-5 w-7" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-[767px]:hidden">
        {taskList.map((task, index) => (
          <div
            key={task.id ?? index}
            className="flex flex-col gap-2.5 self-stretch border-r border-b border-l border-gray-200 bg-white p-3.5 max-[767px]:rounded-[12px] max-[767px]:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="body-xl inline-flex items-center justify-start gap-4 max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-3">
              <div className="flex items-start justify-start gap-0 max-[767px]:w-full max-[767px]:flex-col">
                <div className="w-40 text-xs text-neutral-600">{task.title}</div>
                <div className="hidden w-64 text-xs leading-5 text-neutral-600 min-[1440px]:block">{task.description}</div>
              </div>
              <div className="relative flex items-center justify-start gap-11 max-[767px]:w-full max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-3">
                <div className={`flex w-24 items-center justify-center rounded-[20px] px-3.5 py-1.5 ${statusStyle[task.status]}`}>
                  <div className="text-xs">{task.status}</div>
                </div>
                <div className="flex items-center justify-start gap-3.5">
                  <div className="flex items-center justify-start gap-5">
                    <div className="w-28 text-xs text-neutral-600 max-[1120px]:hidden">{task.startDate}</div>
                    <div className="w-28 text-xs text-neutral-600 max-[1000px]:hidden">{task.endDate}</div>
                    <div className="w-32 whitespace-pre-line text-xs text-neutral-600 max-[890px]:hidden">
                      {task.assignees.replaceAll(', ', '\n')}
                    </div>
                  </div>
                  <div className="h-7 w-7" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 모바일용 */}
      <div className="hidden w-80 flex-col items-start gap-2.5 max-[767px]:inline-flex">
        {taskList.map((task, index) => (
          <div key={task.id ?? index} className="relative flex w-80 flex-col items-start">
            <div className="h-28 self-stretch rounded-tl-[10px] rounded-tr-[10px] border border-zinc-200 bg-white" />
            <div className="flex h-8 flex-col items-start justify-start gap-2.5 self-stretch border-r border-l border-zinc-200 bg-white px-4 py-2.5">
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="justify-center font-['Roboto'] text-xs font-medium text-black">시작일</div>
                <div className="flex items-center justify-start gap-4">
                  <div className="w-24 text-xs text-neutral-600">{task.startDate}</div>
                </div>
              </div>
            </div>
            <div className="flex h-8 flex-col items-start justify-start gap-2.5 self-stretch rounded-br-[10px] rounded-bl-[10px] bg-white px-4 py-2.5 outline outline-1 outline-offset-[-1px] outline-zinc-200">
              <div className="inline-flex items-end justify-between self-stretch">
                <div className="justify-center font-['Roboto'] text-xs font-medium text-black">마감일</div>
                <div className="flex items-center justify-start gap-4">
                  <div className="w-24 text-xs text-neutral-600">{task.endDate}</div>
                </div>
              </div>
            </div>
            <div className="absolute top-[14px] left-[14px] flex w-72 flex-col items-start justify-start gap-2.5">
              <div className="cursor-pointer justify-center self-stretch font-['Roboto'] text-base leading-4 font-medium text-black">
                {task.title}
              </div>
              <div className="h-7 justify-center self-stretch font-['Roboto'] text-[10px] font-normal text-neutral-600">
                {task.description}
              </div>
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="flex items-center justify-start gap-3.5">
                  <div className={`flex w-24 items-center justify-center rounded-[20px] px-3.5 py-1.5 ${statusStyle[task.status]}`}>
                    <div className="text-xs">{task.status}</div>
                  </div>
                  <div className="w-32 whitespace-pre-line text-xs text-neutral-600">
                    {task.assignees.replaceAll(', ', '\n')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompleteTaskPage;
