//반응형 디자인 : 업무내용 -> 시작일/마감일 순으로 지워버리기
import { useEffect, useState } from 'react';

import Modal from '@/components';
import type { TaskStatusApi, TaskStatusLabel } from '@/types/TaskManagement/task';
import searchPaper from '@assets/icon-search-paper.svg';

import Dropdown from '@/components/Dropdown';
import Calender from '@/components/calender';

import useDeleteTask from '@/hooks/TaskPage/Mutate/useDeleteTask';
import usePatchTaskSchedule from '@/hooks/TaskPage/Mutate/usePatchTaskSchedule';
import usePatchTaskStatus from '@/hooks/TaskPage/Mutate/usePatchTaskStatus';
import useGetTaskList from '@/hooks/TaskPage/Query/useGetTaskList';

import AddTaskModal from './AddTaskModal';
import AssigneeDropdown from './AssigneeDropdown';
import GanttChart from './GanttChart';

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

// 실제 데이터 연결 시 null 가능성을 대비해 널 허용
const initialTasks: TaskRow[] = [
  {
    id: 'task-1',
    title: '와이어프레임 제작',
    description: 'UI 디자인을 위한 와이어프레임 제작 후 디자이너에게 연락',
    status: '시작 전',
    startDate: '2025-11-13',
    endDate: '2025-11-24',
    assignees: '팀원1',
    assigneeIds: [],
  },
  {
    id: 'task-2',
    title: 'API  명세서 작성',
    description:
      '와이어프레임 보고 서비스에 기능별 API 제작 : 스웨거로 관리할 거고 REST API 형식...',
    status: '진행 중',
    startDate: '2025-11-13',
    endDate: '2025-11-30',
    assignees: '팀원1, 팀원2, 팀원3, 팀원4',
    assigneeIds: [],
  },
  {
    id: 'task-3',
    title: 'ERD 작성',
    description: '데이터베이스 ERD 작성',
    status: '진행 중',
    startDate: '2025-11-13',
    endDate: '2025-11-30',
    assignees: '팀원1, 팀원2',
    assigneeIds: [],
  },
];

const statusStyle: Record<TaskRow['status'], string> = {
  '시작 전': 'bg-zinc-200 text-neutral-600',
  '진행 중': 'bg-orange-100 text-neutral-600',
  완료: 'bg-orange-300 text-neutral-700',
};

type Props = { projectId: number };

const statusLabelByApi: Record<TaskStatusApi, TaskStatusLabel> = {
  NOT_STARTED: '시작 전',
  IN_PROGRESS: '진행 중',
  DONE: '완료',
};

const statusApiByLabel: Record<TaskStatusLabel, TaskStatusApi> = {
  '시작 전': 'NOT_STARTED',
  '진행 중': 'IN_PROGRESS',
  완료: 'DONE',
};

const normalizeDateInput = (value?: string | null) => {
  if (!value) return '';
  if (value.includes('T')) return value;
  return value.replaceAll('.', '-');
};

const toDateOrToday = (value?: string) => {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

const toIsoString = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
};

const formatDateDisplay = (value?: string) => {
  if (!value) return '';
  const iso = toIsoString(value);
  return iso ? iso.slice(0, 10) : value.slice(0, 10);
};

const TaskManagement = ({ projectId }: Props) => {
  const numericProjectId = Number(projectId);
  const { data: taskListData = [] } = useGetTaskList(numericProjectId);
  const { mutate: patchStatus } = usePatchTaskStatus(numericProjectId);
  const { mutate: patchSchedule } = usePatchTaskSchedule(numericProjectId);
  const { mutate: deleteTaskMutate } = useDeleteTask(numericProjectId);

  const [taskList, setTaskList] = useState<TaskRow[]>(initialTasks);
  const hasTasks = taskList.length > 0;
  const [statusDropdownOpenId, setStatusDropdownOpenId] = useState<string | null>(null);
  const [assigneeDropdownOpenId, setAssigneeDropdownOpenId] = useState<string | null>(null);
  const [addTaskModalIsOpen, setAddTaskModalIsOpen] = useState(false);
  const [datePicker, setDatePicker] = useState<{
    taskId: string;
    field: 'startDate' | 'endDate';
  } | null>(null);
  const [completeTaskModalIsOpen, setCompleteTaskModalIsOpen] = useState(false);

  useEffect(() => {
    if (!taskListData) return;

    const mapped: TaskRow[] = taskListData.map((task) => ({
      id: task.taskId ?? crypto.randomUUID(),
      title: task.name ?? '제목 없음',
      description: task.content ?? '',
      status: statusLabelByApi[task.status] ?? '시작 전',
      startDate: normalizeDateInput(task.startDate),
      endDate: normalizeDateInput(task.dueDate),
      assignees: Array.isArray(task.assignees)
        ? task.assignees
            .map((a) => a.memberName)
            .filter(Boolean)
            .join(', ')
        : '',
      assigneeIds: Array.isArray(task.assignees)
        ? task.assignees
            .map((a) => a.projectMemberId)
            .filter((id: number) => typeof id === 'number' && Number.isFinite(id))
        : [],
    }));

    setTaskList(mapped);
  }, [taskListData]);

  const handleSelectStatus = (taskId: string, status: '시작 전' | '진행 중' | '완료') => {
    const previous = taskList;
    setTaskList((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
    patchStatus(
      { taskId, status: statusApiByLabel[status] },
      {
        onError: () => setTaskList(previous),
      },
    );
    setStatusDropdownOpenId(null);
  };

  const handleChangeSchedule = (taskId: string, field: 'startDate' | 'endDate', value: string) => {
    const previous = taskList;
    const current = taskList.find((t) => t.id === taskId);
    const nextStart = field === 'startDate' ? value : current?.startDate || value;
    const nextDue = field === 'endDate' ? value : current?.endDate || value;

    setTaskList((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, startDate: nextStart, endDate: nextDue } : task,
      ),
    );

    patchSchedule(
      { taskId, startDate: toIsoString(nextStart), dueDate: toIsoString(nextDue) },
      {
        onError: () => setTaskList(previous),
      },
    );
  };

  const handleDelete = (taskId: string) => {
    const previous = taskList;
    setTaskList((prev) => prev.filter((task) => task.id !== taskId));
    deleteTaskMutate(taskId, {
      onError: () => setTaskList(previous),
    });
  };

  if (!hasTasks) {
    return (
      <div className="pb-gap-4 mt-[133px] flex w-full flex-col items-center justify-center">
        <div className="inline-flex w-48 flex-col items-center justify-start gap-4">
          <div className="inline-flex h-48 items-center justify-center gap-2.5 self-stretch rounded-[100px] bg-orange-100 p-8">
            <div className="relative h-32 w-32 overflow-hidden">
              <img src={searchPaper} alt="search paper" />
            </div>
          </div>
          <div className="flex w-80 flex-col items-center justify-start gap-3">
            <div className="h-7 justify-center self-stretch text-center text-2xl font-medium text-black">
              아직 등록된 업무가 없어요
            </div>
            <div className="h-10 justify-center self-stretch text-center text-sm font-normal text-black">
              업무를 추가해 팀원들과 작업을 시작해 보세요
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-12 w-36 items-center justify-center gap-2.5 rounded-[10px] bg-orange-500 px-2 py-[5px] text-sm font-medium text-white"
            onClick={() => setAddTaskModalIsOpen(true)}
          >
            업무 추가
          </button>
        </div>
      </div>
    );
  }

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
              <div className="w-32 truncate text-xs text-neutral-600">{task.title}</div>
              <div
                className="w-72 text-xs leading-5 text-neutral-600"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {task.description}
              </div>
            </div>
            <div className="relative flex items-center justify-start gap-11">
              <div className="relative flex items-center justify-center">
                <div
                  className={`flex w-20 items-center justify-center rounded-[20px] px-3.5 py-1.5 ${statusStyle[task.status]}`}
                  onClick={() =>
                    setStatusDropdownOpenId((prev) => (prev === task.id ? null : task.id))
                  }
                >
                  <div className="text-xs">{task.status}</div>
                </div>
                {statusDropdownOpenId === task.id && (
                  <Dropdown
                    isOpen={statusDropdownOpenId === task.id}
                    onClose={() => setStatusDropdownOpenId(null)}
                    usePortal={false}
                  >
                    <div className="absolute top-full left-0 z-20 mt-2 flex h-32 w-24 flex-col gap-2.5 rounded-[10px] bg-white px-3 py-3 text-xs shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]">
                      <div
                        className="flex h-7 w-[78px] items-center justify-center self-stretch rounded-[20px] bg-zinc-200"
                        onClick={() => handleSelectStatus(task.id, '시작 전')}
                      >
                        시작 전
                      </div>
                      <div
                        className="flex h-7 w-[78px] items-center justify-center self-stretch rounded-[20px] bg-orange-100"
                        onClick={() => handleSelectStatus(task.id, '진행 중')}
                      >
                        진행 중
                      </div>
                      <div
                        className="flex h-7 w-[78px] items-center justify-center self-stretch rounded-[20px] bg-orange-300"
                        onClick={() => handleSelectStatus(task.id, '완료')}
                      >
                        완료
                      </div>
                    </div>
                  </Dropdown>
                )}
              </div>
              <div className="flex items-center justify-start gap-3.5">
                <div className="flex items-center justify-start gap-5">
                  <div className="relative">
                    <div
                      className="w-24 cursor-pointer text-xs text-neutral-600"
                      onClick={() => setDatePicker({ taskId: task.id, field: 'startDate' })}
                    >
                      {formatDateDisplay(task.startDate)}
                    </div>
                    {datePicker?.taskId === task.id && datePicker.field === 'startDate' && (
                      <div className="absolute z-10 mt-2">
                        <Calender
                          prev={toDateOrToday(task.startDate)}
                          next={(date) => {
                            const formatted = date.toISOString();
                            handleChangeSchedule(task.id, 'startDate', formatted);
                            setDatePicker(null);
                          }}
                          onClose={() => setDatePicker(null)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <div
                      className="w-24 cursor-pointer text-xs text-neutral-600"
                      onClick={() => setDatePicker({ taskId: task.id, field: 'endDate' })}
                    >
                      {formatDateDisplay(task.endDate)}
                    </div>
                    {datePicker?.taskId === task.id && datePicker.field === 'endDate' && (
                      <div className="absolute z-10 mt-2">
                        <Calender
                          prev={toDateOrToday(task.endDate)}
                          next={(date) => {
                            const formatted = date.toISOString();
                            handleChangeSchedule(task.id, 'endDate', formatted);
                            setDatePicker(null);
                          }}
                          onClose={() => setDatePicker(null)}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="relative"
                    onClick={() =>
                      setAssigneeDropdownOpenId((prev) => (prev === task.id ? null : task.id))
                    }
                  >
                    <div className="w-24 cursor-pointer text-xs whitespace-pre-line text-neutral-600 break-words">
                      {task.assignees?.trim()
                        ? task.assignees.replaceAll(', ', '\n')
                        : '담당자 없음'}
                    </div>
                    {assigneeDropdownOpenId === task.id && (
                      <Dropdown
                        isOpen={assigneeDropdownOpenId === task.id}
                        onClose={() => setAssigneeDropdownOpenId(null)}
                        usePortal={false}
                      >
                        <div className="absolute top-full left-0 z-20 mt-2">
                          <AssigneeDropdown
                            projectId={numericProjectId}
                            taskId={task.id}
                            selectedAssigneeIds={task.assigneeIds}
                            onClose={() => setAssigneeDropdownOpenId(null)}
                            onUpdate={(assigneeIds, assigneeNames) => {
                              setTaskList((prev) =>
                                prev.map((t) =>
                                  t.id === task.id
                                    ? { ...t, assigneeIds, assignees: assigneeNames.join(', ') }
                                    : t,
                                ),
                              );
                            }}
                          />
                        </div>
                      </Dropdown>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="h-7 w-7 text-center text-xs text-neutral-400"
                  onClick={() => setCompleteTaskModalIsOpen(!completeTaskModalIsOpen)}
                >
                  삭제
                </button>
              </div>
              {completeTaskModalIsOpen && (
                <Modal
                  isOpen={completeTaskModalIsOpen}
                  onClose={() => setCompleteTaskModalIsOpen(false)}
                >
                  <div className="inline-flex h-[250px] w-[450px] flex-col items-start justify-start gap-2.5 rounded-[10px] bg-white px-8 py-9">
                    <div className="flex w-96 flex-col items-center justify-start gap-4">
                      <div className="h-12 justify-center self-stretch text-center font-['Roboto'] text-3xl font-bold text-black">
                        업무 삭제
                      </div>
                      <div className="h-12 justify-center self-stretch text-center font-['Roboto'] text-base font-normal text-black">
                        해당 업무를 삭제할까요?
                      </div>
                      <div className="inline-flex items-center justify-start gap-6 self-stretch">
                        <div className="flex h-12 w-44 items-center justify-center gap-2.5 rounded-[5px] bg-zinc-300 px-4 py-2 outline outline-1 outline-offset-[-1px] outline-gray-200">
                          <div
                            className="justify-center text-center font-['Roboto'] text-base leading-4 font-medium text-black"
                            onClick={() => setCompleteTaskModalIsOpen(false)}
                          >
                            아니요
                          </div>
                        </div>
                        <div className="flex h-12 w-44 items-center justify-center gap-2.5 rounded-[5px] bg-blue-600 px-4 py-2 outline outline-1 outline-offset-[-1px] outline-gray-200">
                          <div
                            className="justify-center text-center font-['Roboto'] text-base leading-4 font-medium text-white"
                            onClick={() => {
                              handleDelete(task.id);
                              setCompleteTaskModalIsOpen(false);
                            }}
                          >
                            예
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="right-0 mt-[30px] flex h-[32px] w-[90px] cursor-pointer items-center justify-center rounded-[10px] bg-orange-500 text-xs text-white"
        onClick={() => setAddTaskModalIsOpen(true)}
      >
        업무 추가
      </button>
      {addTaskModalIsOpen && (
        <Modal isOpen={addTaskModalIsOpen} onClose={() => setAddTaskModalIsOpen(false)}>
          <AddTaskModal projectId={numericProjectId} />
        </Modal>
      )}

      <div className="mt-7.5">
        <GanttChart
          tasks={taskList.map((t) => ({
            id: t.id,
            name: t.title,
            startDate: t.startDate,
            endDate: t.endDate,
          }))}
        />
      </div>
    </div>
  );
};

export default TaskManagement;
