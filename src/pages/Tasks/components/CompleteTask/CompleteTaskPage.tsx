import useGetCompletedTasks from '@/hooks/TaskPage/Query/useGetCompletedTasks';
import type { CompleteTaskStatusApi, CompleteTaskStatusLabel } from '@/types/TaskManagement/taskComplete';

const statusStyle: Record<CompleteTaskStatusLabel, string> = {
  '시작 전': 'bg-zinc-200 text-neutral-600',
  '진행 중': 'bg-orange-100 text-neutral-600',
  '완료': 'bg-orange-300 text-neutral-700',
};

const statusLabelByApi: Record<CompleteTaskStatusApi, CompleteTaskStatusLabel> = {
  NOT_STARTED: '시작 전',
  IN_PROGRESS: '진행 중',
  DONE: '완료',
};

const normalizeDate = (value?: string | null) => {
  if (!value) return '';
  return value.includes('T') ? value.slice(0, 10) : value.replaceAll('-', '.');
};

const formatAssignees = (assignees?: { nickname?: string }[]) => {
  if (!Array.isArray(assignees)) return '';
  return assignees.map((a) => a?.nickname).filter(Boolean).join(', ');
};

type Props = {
  projectId: number;
};

type TaskRow = {
  id: string | number;
  title: string;
  description: string;
  status: CompleteTaskStatusLabel;
  startDate: string;
  endDate: string;
  assignees: string;
};

const CompleteTaskPage = ({ projectId }: Props) => {
  const { data } = useGetCompletedTasks(projectId);

  const taskList: TaskRow[] = Array.isArray(data)
    ? data.map((task) => ({
        id: task.taskId,
        title: task.title,
        description: task.contents,
        status: statusLabelByApi[task.status] ?? '완료',
        startDate: normalizeDate(task.startDate),
        endDate: normalizeDate(task.endDate),
        assignees: formatAssignees(task.assignees),
      }))
    : [];

  return (
    <div className="inline-flex w-full flex-col items-start justify-start">
      <div className="flex h-12 flex-col justify-center self-stretch bg-slate-100 p-3.5 outline-gray-200">
        <div className="inline-flex items-center justify-start gap-60">
          <div className="flex w-56 items-center justify-start gap-16">
            <div className="h-5 w-20 text-sm text-black">업무명</div>
            <div className="h-5 w-20 text-sm text-black">업무내용</div>
          </div>
          <div className="flex items-start justify-start gap-16">
            <div className="h-5 w-7 text-center text-sm text-black">상태</div>
            <div className="flex h-5 items-center justify-start gap-10">
              <div className="h-5 w-20 text-sm text-black">시작일</div>
              <div className="h-5 w-20 text-sm text-black">마감일</div>
              <div className="h-5 w-16 text-sm text-black">담당자</div>
              <div className="h-5 w-7" />
            </div>
          </div>
        </div>
      </div>

      {taskList.map((task, index) => (
        <div
          key={task.id ?? index}
          className="flex flex-col gap-2.5 self-stretch border-r border-b border-l border-gray-200 bg-white p-3.5"
        >
          <div className="body-xl inline-flex items-center justify-start gap-4">
            <div className="flex items-start justify-start gap-3.5">
              <div className="w-32 text-xs text-neutral-600">{task.title}</div>
              <div className="w-72 text-xs leading-5 text-neutral-600">{task.description}</div>
            </div>
            <div className="relative flex items-center justify-start gap-11">
              <div
                className={`flex w-20 items-center justify-center rounded-[20px] px-3.5 py-1.5 ${statusStyle[task.status]}`}
              >
                <div className="text-xs">{task.status}</div>
              </div>
              <div className="flex items-center justify-start gap-3.5">
                <div className="flex items-center justify-start gap-5">
                  <div className="w-24 text-xs text-neutral-600">{task.startDate}</div>
                  <div className="w-24 text-xs text-neutral-600">{task.endDate}</div>
                  <div className="w-24 whitespace-pre-line text-xs text-neutral-600">
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
  );
};

export default CompleteTaskPage;
