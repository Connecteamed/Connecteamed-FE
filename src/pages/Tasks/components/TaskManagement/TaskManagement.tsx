//반응형 디자인 : 업무내용 -> 시작일/마감일 순으로 지워버리기
import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Modal from '@/components';
import type { TaskStatusApi, TaskStatusLabel } from '@/types/TaskManagement/task';
import mobileRightArrow from '@assets/icon-mobile-rightarrow.svg';
import searchPaper from '@assets/icon-search-paper.svg';

import Dropdown from '@/components/Dropdown';
import Calender from '@/components/calender';

import useDeleteTask from '@/hooks/TaskPage/Mutate/useDeleteTask';
import usePatchTaskAssignees from '@/hooks/TaskPage/Mutate/usePatchTaskAssignees';
import usePatchTaskSchedule from '@/hooks/TaskPage/Mutate/usePatchTaskSchedule';
import usePatchTaskStatus from '@/hooks/TaskPage/Mutate/usePatchTaskStatus';
import useGetProjectMemberList from '@/hooks/TaskPage/Query/useGetProjectMemberList';
import useGetTaskList from '@/hooks/TaskPage/Query/useGetTaskList';

import AddTaskModal from './AddTaskModal';
import AssigneeDropdown from './AssigneeDropdown';
import GanttChart from './GanttChart';
import MobileAssigneeBottomSheet from './MobileAssigneeBottomSheet';
import MobileScheduleBottomSheet from './MobileScheduleBottomSheet';
import MobileStatusBottomSheet from './MobileStatusBottomSheet';
import TaskDetailModal from './TaskDetailModal';

export type TaskRow = {
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

const formatDateDisplayDots = (value?: string) => {
  const base = formatDateDisplay(value);
  return base ? base.replaceAll('-', '.') : '';
};

const TaskManagement = ({ projectId }: Props) => {
  const numericProjectId = Number(projectId);
  const navigate = useNavigate();
  const { data: taskListData = [] } = useGetTaskList(numericProjectId);
  const { mutate: patchStatus } = usePatchTaskStatus(numericProjectId);
  const { mutate: patchSchedule } = usePatchTaskSchedule(numericProjectId);
  const { mutate: deleteTaskMutate } = useDeleteTask(numericProjectId);
  const { mutate: patchAssignees } = usePatchTaskAssignees(numericProjectId);
  const { data: projectMembers = [] } = useGetProjectMemberList(numericProjectId);

  const [taskList, setTaskList] = useState<TaskRow[]>(initialTasks);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [statusDropdownOpenId, setStatusDropdownOpenId] = useState<string | null>(null);
  const [assigneeDropdownOpenId, setAssigneeDropdownOpenId] = useState<string | null>(null);
  const [addTaskModalIsOpen, setAddTaskModalIsOpen] = useState(false);
  const [taskDetailModalIsOpen, setTaskDetailModalIsOpen] = useState(false);
  const [datePicker, setDatePicker] = useState<{
    taskId: string;
    field: 'startDate' | 'endDate';
  } | null>(null);
  const [scheduleSheet, setScheduleSheet] = useState<{
    taskId: string;
    activeField: 'startDate' | 'endDate';
    draftStart: string;
    draftEnd: string;
  } | null>(null);
  const [statusSheet, setStatusSheet] = useState<{
    taskId: string;
    draftStatus: TaskStatusLabel;
  } | null>(null);
  const [completeTaskModalIsOpen, setCompleteTaskModalIsOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  // const [resolvedCurrentMemberId, setResolvedCurrentMemberId] = useState<number | null>(
  //   Number.isFinite(currentMemberId) ? (currentMemberId as number) : null,
  // );
  const [mobileAssigneeTaskId, setMobileAssigneeTaskId] = useState<string | null>(null);
  const [mobileAssigneeIds, setMobileAssigneeIds] = useState<number[]>([]);

  // currentMemberId 관련 코드 완전 제거

  const memberNameById = useMemo(
    () =>
      projectMembers.reduce<Record<number, string>>((acc, cur) => {
        if (Number.isFinite(cur.projectMemberId)) {
          acc[cur.projectMemberId] = cur.memberName ?? '';
        }
        return acc;
      }, {}),
    [projectMembers],
  );

  const getCurrentMemberId = (): number | null => {
    const stored = localStorage.getItem('memberId');
    if (!stored) return null;

    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const currentMemberId = getCurrentMemberId();

  const isMyTask = (task: TaskRow) => {
    if (currentMemberId === null) return false;
    return task.assigneeIds?.includes(currentMemberId) ?? false;
  };

  const myTasks = useMemo(() => {
    if (!showMyTasksOnly) return taskList;
    if (currentMemberId === null) return [];

    return taskList.filter((task) =>
      task.assigneeIds?.includes(currentMemberId) ?? false
    );
  }, [taskList, showMyTasksOnly, currentMemberId]);

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 transform';
    toast.innerHTML = `
      <div class="w-80 h-20 px-9 py-4 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-center items-center gap-2.5 shadow-lg">
        <div class="text-center justify-center text-black text-lg font-medium font-['Roboto']">${message}</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  };

  const persistSchedule = (taskId: string, startValue: string, endValue: string) => {
    const previous = taskList;

    setTaskList((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, startDate: startValue, endDate: endValue } : task,
      ),
    );

    patchSchedule(
      { taskId, startDate: toIsoString(startValue), dueDate: toIsoString(endValue) },
      {
        onError: () => setTaskList(previous),
      },
    );
  };

  const openScheduleSheet = (task: TaskRow, field: 'startDate' | 'endDate') => {
    setScheduleSheet({
      taskId: task.id,
      activeField: field,
      draftStart: task.startDate,
      draftEnd: task.endDate,
    });
  };

  const closeScheduleSheet = () => setScheduleSheet(null);

  const handleScheduleTab = (field: 'startDate' | 'endDate') => {
    setScheduleSheet((prev) => (prev ? { ...prev, activeField: field } : prev));
  };

  const handleSelectScheduleDate = (date: Date) => {
    setScheduleSheet((prev) => {
      if (!prev) return prev;
      const iso = date.toISOString();
      const next =
        prev.activeField === 'startDate'
          ? { ...prev, draftStart: iso }
          : { ...prev, draftEnd: iso };

      if (prev.activeField === 'startDate') {
        return { ...next, activeField: 'endDate' };
      }

      return next;
    });
  };

  const handleSaveScheduleSheet = () => {
    if (!scheduleSheet) return;

    const { taskId, draftStart, draftEnd } = scheduleSheet;
    const startTime = draftStart ? new Date(draftStart).getTime() : NaN;
    const endTime = draftEnd ? new Date(draftEnd).getTime() : NaN;

    if (!Number.isNaN(startTime) && !Number.isNaN(endTime) && startTime > endTime) {
      showToast('시작일은 마감일보다 빠를 수 없어요');
      return;
    }

    persistSchedule(taskId, draftStart, draftEnd);
    closeScheduleSheet();
  };

  const openMobileAssigneeSheet = (task: TaskRow) => {
    setMobileAssigneeTaskId(task.id);
    setMobileAssigneeIds(task.assigneeIds ?? []);
  };

  const toggleMobileAssignee = (projectMemberId: number) => {
    setMobileAssigneeIds((prev) =>
      prev.includes(projectMemberId)
        ? prev.filter((id) => id !== projectMemberId)
        : [...prev, projectMemberId],
    );
  };

  const openMobileStatusSheet = (task: TaskRow) => {
    setStatusSheet({ taskId: task.id, draftStatus: task.status });
  };

  const closeMobileStatusSheet = () => setStatusSheet(null);
  const handleSaveStatusSheet = (status: TaskStatusLabel) => {
    if (!statusSheet) return;
    handleSelectStatus(statusSheet.taskId, status);
    closeMobileStatusSheet();
  };

  const closeMobileAssigneeSheet = () => {
    setMobileAssigneeTaskId(null);
    setMobileAssigneeIds([]);
  };

  const handleSaveMobileAssignees = () => {
    if (!mobileAssigneeTaskId) return;

    const selectedIds = mobileAssigneeIds;
    const taskId = mobileAssigneeTaskId;
    const previous = taskList;
    const assigneeNames = selectedIds.map((id) => memberNameById[id]).filter(Boolean);

    setTaskList((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, assigneeIds: selectedIds, assignees: assigneeNames.join(', ') }
          : t,
      ),
    );

    patchAssignees(
      { taskId, assigneeProjectMemberIds: selectedIds },
      {
        onError: () => {
          setTaskList(previous);
          showToast('담당자 저장에 실패했어요');
        },
      },
    );

    closeMobileAssigneeSheet();
  };

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
        onError: (error: any) => {
          setTaskList(previous);
          if (status === '완료' && error?.response?.data?.code === 'TASK403') {
            showToast('완료로 상태변경은 <br/>본인 업무만 가능합니다');
          }
        },
      },
    );
    setStatusDropdownOpenId(null);
  };

  const handleChangeSchedule = (taskId: string, field: 'startDate' | 'endDate', value: string) => {
    const current = taskList.find((t) => t.id === taskId);
    const nextStart = field === 'startDate' ? value : current?.startDate || value;
    const nextDue = field === 'endDate' ? value : current?.endDate || value;

    persistSchedule(taskId, nextStart, nextDue);
  };

  const handleDelete = (taskId: string) => {
    const previous = taskList;
    setTaskList((prev) => prev.filter((task) => task.id !== taskId));
    deleteTaskMutate(taskId, {
      onError: () => setTaskList(previous),
    });
  };

  const findTaskIndexById = (taskId: string) => taskList.findIndex((t) => t.id === taskId);

  const hasVisibleTasks = myTasks.length > 0;
  const scheduleSheetTask = scheduleSheet
    ? taskList.find((t) => t.id === scheduleSheet.taskId)
    : null;
  const statusSheetTask = statusSheet ? taskList.find((t) => t.id === statusSheet.taskId) : null;

  const scheduleActiveDate = scheduleSheet
    ? toDateOrToday(
        scheduleSheet.activeField === 'startDate'
          ? scheduleSheet.draftStart || scheduleSheetTask?.startDate
          : scheduleSheet.draftEnd || scheduleSheetTask?.endDate,
      )
    : new Date();

  const scheduleStartDisplay = formatDateDisplayDots(
    scheduleSheet?.draftStart || scheduleSheetTask?.startDate || '',
  );
  const scheduleEndDisplay = formatDateDisplayDots(
    scheduleSheet?.draftEnd || scheduleSheetTask?.endDate || '',
  );

  const goToTaskDetail = (taskId: string) => {
    navigate(`/team/${projectId}/task/${taskId}`);
  };

  const handleTitleClick = (taskId: string, index: number) => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      goToTaskDetail(taskId);
      return;
    }
    const foundIndex = findTaskIndexById(taskId);
    setSelectedTaskIndex(foundIndex >= 0 ? foundIndex : index);
    setTaskDetailModalIsOpen(true);
  };

  console.log(myTasks);
  

  if (!hasVisibleTasks) {
    return (
      <div className="pb-gap-4 flex py-25 gap-4 w-full flex-col items-center justify-center max-[767px]:min-h-screen max-[767px]:py-10">
        <div className="inline-flex w-48 flex-col items-center justify-start gap-4 max-[767px]:hidden">
          <div className="inline-flex h-48 items-center justify-center gap-2.5 self-stretch rounded-[100px] bg-orange-100 p-8">
            <div className="relative h-32 w-32 overflow-hidden">
              <img src={searchPaper} alt="search paper" />
            </div>
          </div>
          <div className="flex w-80 flex-col items-center gap-3 justify-start">
            <div className="h-[28px] justify-center self-stretch text-center text-2xl font-medium text-black">
              아직 등록된 업무가 없어요
            </div>
            <div className="h-[40px] justify-center items-center self-stretch text-center font-normal text-black">
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

        <div className="hidden w-full flex-col items-center justify-center gap-4 py-10 max-[767px]:inline-flex">
          <div className="inline-flex w-48 flex-col items-center justify-start gap-4">
            <div className="inline-flex h-24 w-24 items-center justify-center gap-2.5 rounded-[100px] bg-orange-100 p-8">
              <div className="relative h-20 w-20 overflow-hidden">
                <img
                  src={searchPaper}
                  alt="search paper"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex w-80 flex-col items-center justify-start gap-1.5">
              <div className="h-7 self-stretch text-center text-sm font-medium text-black">
                아직 등록된 업무가 없어요
              </div>
              <div className="h-10 self-stretch text-center text-[10px] font-normal text-black">
                업무를 추가해 팀원들과 작업을 시작해 보세요
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-36 items-center justify-center gap-2.5 rounded-md bg-orange-500 px-2 py-[5px] text-xs font-medium text-white"
              onClick={() => setAddTaskModalIsOpen(true)}
            >
              업무 추가
            </button>
          </div>
        </div>
        {setAddTaskModalIsOpen && (
          <Modal isOpen={addTaskModalIsOpen} onClose={() => setAddTaskModalIsOpen(false)}>
            <AddTaskModal
              projectId={numericProjectId}
              />
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex w-full flex-col items-start justify-start">
      <div className="hidden w-80 flex-col items-end gap-2.5 self-stretch max-[767px]:inline-flex">
        <div className="flex flex-col items-end justify-start gap-1.5 self-stretch">
          <button
            type="button"
            className="inline-flex items-center justify-start gap-1"
            onClick={() => setShowMyTasksOnly((prev) => !prev)}
          >
            <div
              className={`h-1.5 w-1.5 border-[0.50px] border-gray-300 ${
                showMyTasksOnly ? 'bg-orange-500' : 'bg-white'
              }`}
            />
            <div className="justify-center font-['Roboto'] text-[6px] font-normal text-black">
              내 업무만 보기
            </div>
          </button>
        </div>
      </div>

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

      <div className="hidden w-80 flex-col items-start gap-2.5 max-[767px]:inline-flex">
        {myTasks.map((task, index) => (
          <div key={task.id ?? index} className="relative flex w-80 flex-col items-start">
            <div className="h-28 self-stretch rounded-tl-[10px] rounded-tr-[10px] border border-zinc-200 bg-white" />
            <div className="flex h-8 flex-col items-start justify-start gap-2.5 self-stretch border-r border-l border-zinc-200 bg-white px-4 py-2.5">
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="justify-center font-['Roboto'] text-xs font-medium text-black">
                  시작일
                </div>
                <div className="flex items-center justify-start gap-4">
                  <div className="flex items-center justify-start gap-6">
                    <div
                      className="justify-center font-['Roboto'] text-[10px] font-normal text-black"
                      onClick={() => openScheduleSheet(task, 'startDate')}
                    >
                      {formatDateDisplay(task.startDate)}
                    </div>
                  </div>
                  <div className="relative h-3 w-1.5 origin-top-left rotate-180 overflow-hidden">
                    <img
                      src={mobileRightArrow}
                      alt="달력 아이콘"
                      className="absolute top-[1.75px] left-[1px] h-2 w-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-8 flex-col items-start justify-start gap-2.5 self-stretch rounded-br-[10px] rounded-bl-[10px] bg-white px-4 py-2.5 outline outline-1 outline-offset-[-1px] outline-zinc-200">
              <div className="inline-flex items-end justify-between self-stretch">
                <div className="justify-center font-['Roboto'] text-xs font-medium text-black">
                  마감일
                </div>
                <div className="flex items-center justify-start gap-4">
                  <div className="flex items-center justify-start gap-6">
                    <div
                      className="justify-center font-['Roboto'] text-[10px] font-normal text-black"
                      onClick={() => openScheduleSheet(task, 'endDate')}
                    >
                      {formatDateDisplay(task.endDate)}
                    </div>
                  </div>
                  <div className="relative h-3 w-1.5 origin-top-left rotate-180 overflow-hidden">
                    <img
                      src={mobileRightArrow}
                      alt="달력 아이콘"
                      className="absolute top-[1.75px] left-[1px] h-2 w-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-[14px] left-[14px] flex w-72 flex-col items-start justify-start gap-2.5">
              <div
                className="cursor-pointer justify-center self-stretch font-['Roboto'] text-base leading-4 font-medium text-black"
                onClick={() => goToTaskDetail(task.id)}
              >
                {task.title}
              </div>
              <div className="h-7 justify-center self-stretch font-['Roboto'] text-[10px] font-normal text-neutral-600">
                {task.description}
              </div>
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="flex items-center justify-start gap-3.5">
                  <div
                    className={`flex h-4 w-10 items-center justify-center gap-4 rounded-[20px] px-3.5 py-1.5 ${statusStyle[task.status]}`}
                    onClick={() => openMobileStatusSheet(task)}
                  >
                    <div className="justify-center text-center font-['Roboto'] text-[8px] font-medium text-neutral-600">
                      {task.status}
                    </div>
                  </div>
                  <div
                    className="cursor-pointer justify-center font-['Roboto'] text-[10px] font-medium text-neutral-600"
                    onClick={() => openMobileAssigneeSheet(task)}
                  >
                    {task.assignees || '담당자 없음'}
                  </div>
                </div>
                <div
                  className="justify-center font-['Roboto'] text-xs font-medium text-neutral-400"
                  onClick={() => {
                    setTaskToDeleteId(task.id);
                    setCompleteTaskModalIsOpen(true);
                  }}
                >
                  삭제
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="inline-flex h-5 w-16 items-center justify-center gap-2.5 rounded-[5px] bg-orange-500 px-2 py-[5px] font-['Roboto'] text-[8px] font-medium text-white"
          onClick={() => navigate(`/team/${projectId}/task/new`)}
        >
          업무 추가
        </button>
      </div>

      <div className="max-[767px]:hidden">
        {myTasks.map((task, index) => (
          <div
            key={task.id ?? index}
            className="flex flex-col gap-2.5 self-stretch border-r border-b border-l border-gray-200 bg-white p-3.5 max-[767px]:rounded-[12px] max-[767px]:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="body-xl inline-flex items-center justify-start gap-4 max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-3">
              <div className="flex items-start justify-start gap-0 max-[767px]:w-full max-[767px]:flex-col">
                <div
                  className="w-40 cursor-pointer truncate text-xs text-neutral-600 max-[767px]:w-full max-[767px]:text-base max-[767px]:font-semibold"
                  onClick={() => handleTitleClick(task.id, index)}
                >
                  {task.title}
                </div>
                <div
                  className="hidden w-64 text-xs leading-5 text-neutral-600 min-[1440px]:block max-[767px]:block max-[767px]:w-full max-[767px]:text-sm"
                  style={{
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {task.description}
                </div>
              </div>

              <div className="relative flex items-center justify-start gap-11 max-[767px]:w-full max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-3">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`flex w-24 items-center justify-center rounded-[20px] px-3.5 py-1.5 ${statusStyle[task.status]} max-[767px]:w-24 max-[767px]:text-sm`}
                    onClick={() =>
                      setStatusDropdownOpenId((prev) => (prev === task.id ? null : task.id))
                    }
                  >
                    <div className="text-xs max-[767px]:text-sm">{task.status}</div>
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

                <div className="flex items-center justify-start gap-3.5 max-[767px]:w-full max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-2">
                  <div className="flex items-center justify-start gap-5 max-[767px]:w-full max-[767px]:flex-wrap max-[767px]:gap-3">
                    <div className="relative max-[1120px]:hidden max-[767px]:block max-[767px]:w-full">
                      <div className="hidden text-[11px] text-neutral-500 max-[767px]:block">
                        시작일
                      </div>
                      <div
                        className="w-28 cursor-pointer text-xs text-neutral-600 max-[767px]:w-full max-[767px]:rounded-[8px] max-[767px]:bg-slate-50 max-[767px]:px-3 max-[767px]:py-2 max-[767px]:text-sm"
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

                    <div className="relative max-[1000px]:hidden max-[767px]:block max-[767px]:w-full">
                      <div className="hidden text-[11px] text-neutral-500 max-[767px]:block">
                        마감일
                      </div>
                      <div
                        className="w-28 cursor-pointer text-xs text-neutral-600 max-[767px]:w-full max-[767px]:rounded-[8px] max-[767px]:bg-slate-50 max-[767px]:px-3 max-[767px]:py-2 max-[767px]:text-sm"
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
                      className="relative flex-shrink-0 max-[890px]:hidden max-[767px]:block max-[767px]:w-full"
                      onClick={() =>
                        setAssigneeDropdownOpenId((prev) => (prev === task.id ? null : task.id))
                      }
                    >
                      <div className="hidden text-[11px] text-neutral-500 max-[767px]:block">
                        담당자
                      </div>
                      <div className="w-32 cursor-pointer text-xs break-words whitespace-pre-line text-neutral-600 max-[767px]:w-full max-[767px]:rounded-[8px] max-[767px]:bg-slate-50 max-[767px]:px-3 max-[767px]:py-2 max-[767px]:text-sm">
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
                    className="h-7 w-7 text-center text-xs text-neutral-400 max-[767px]:self-end max-[767px]:text-sm"
                    onClick={() => {
                      setTaskToDeleteId(task.id);
                      setCompleteTaskModalIsOpen(true);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="right-0 mt-[30px] hidden h-[32px] w-[90px] cursor-pointer items-center justify-center rounded-[10px] bg-orange-500 text-xs text-white max-[767px]:hidden min-[768px]:flex"
        onClick={() => setAddTaskModalIsOpen(true)}
      >
        업무 추가
      </button>
      {addTaskModalIsOpen && (
        <Modal isOpen={addTaskModalIsOpen} onClose={() => setAddTaskModalIsOpen(false)}>
          <AddTaskModal projectId={numericProjectId} />
        </Modal>
      )}

      <div className="mt-7.5 max-[767px]:hidden">
        <GanttChart
          tasks={taskList.map((t) => ({
            id: t.id,
            name: t.title,
            startDate: t.startDate,
            endDate: t.endDate,
          }))}
        />
      </div>
      {taskDetailModalIsOpen && selectedTaskIndex !== null && (
        <Modal isOpen={taskDetailModalIsOpen} onClose={() => setTaskDetailModalIsOpen(false)}>
          <TaskDetailModal
            title={taskList[selectedTaskIndex]?.title ?? ''}
            status={taskList[selectedTaskIndex]?.status ?? ''}
            assignees={taskList[selectedTaskIndex]?.assignees ?? ''}
            content={taskList[selectedTaskIndex]?.description ?? ''}
            startDate={taskList[selectedTaskIndex]?.startDate ?? ''}
            endDate={taskList[selectedTaskIndex]?.endDate ?? ''}
            editable={isMyTask(taskList[selectedTaskIndex])}
          />
        </Modal>
      )}

      {completeTaskModalIsOpen && (
        <Modal isOpen={completeTaskModalIsOpen} onClose={() => setCompleteTaskModalIsOpen(false)}>
          <div className="inline-flex h-[250px] w-[450px] flex-col items-start justify-start gap-2.5 rounded-[10px] bg-white px-8 py-9">
            <div className="flex w-96 flex-col items-center justify-start gap-4">
              <div className="h-12 justify-center self-stretch text-center font-['Roboto'] text-3xl font-bold text-black">
                업무 삭제
              </div>
              <div className="h-12 justify-center self-stretch text-center font-['Roboto'] text-base font-normal text-black">
                해당 업무를 삭제할까요?
              </div>
              <div className="inline-flex items-center justify-start gap-6 self-stretch">
                <div
                  className="flex h-12 w-44 cursor-pointer items-center justify-center gap-2.5 rounded-[5px] bg-zinc-300 px-4 py-2 outline outline-1 outline-offset-[-1px] outline-gray-200"
                  onClick={() => {
                    setCompleteTaskModalIsOpen(false);
                    setTaskToDeleteId(null);
                  }}
                >
                  <div className="justify-center text-center font-['Roboto'] text-base leading-4 font-medium text-black">
                    아니요
                  </div>
                </div>
                <div
                  className="flex h-12 w-44 cursor-pointer items-center justify-center gap-2.5 rounded-[5px] bg-blue-600 px-4 py-2 outline outline-1 outline-offset-[-1px] outline-gray-200"
                  onClick={() => {
                    if (taskToDeleteId) {
                      handleDelete(taskToDeleteId);
                    }
                    setCompleteTaskModalIsOpen(false);
                    setTaskToDeleteId(null);
                  }}
                >
                  <div className="justify-center text-center font-['Roboto'] text-base leading-4 font-medium text-white">
                    예
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <MobileScheduleBottomSheet
        isOpen={Boolean(scheduleSheet)}
        activeField={scheduleSheet?.activeField ?? 'startDate'}
        startDisplay={scheduleStartDisplay}
        endDisplay={scheduleEndDisplay}
        activeDate={scheduleActiveDate}
        onSelectTab={handleScheduleTab}
        onPickDate={handleSelectScheduleDate}
        onSave={handleSaveScheduleSheet}
        onClose={closeScheduleSheet}
        isSaveDisabled={!scheduleSheet}
      />

      <MobileStatusBottomSheet
        isOpen={Boolean(statusSheet)}
        currentStatus={statusSheet?.draftStatus ?? statusSheetTask?.status ?? '시작 전'}
        onClose={closeMobileStatusSheet}
        onSave={handleSaveStatusSheet}
      />

      <MobileAssigneeBottomSheet
        isOpen={Boolean(mobileAssigneeTaskId)}
        members={projectMembers}
        selectedIds={mobileAssigneeIds}
        onToggle={toggleMobileAssignee}
        onSave={handleSaveMobileAssignees}
        onClose={closeMobileAssigneeSheet}
      />
    </div>
  );
};

export default TaskManagement;
