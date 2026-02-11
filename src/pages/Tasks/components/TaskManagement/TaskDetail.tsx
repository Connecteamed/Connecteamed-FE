import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MobileAssigneeBottomSheet from './MobileAssigneeBottomSheet';
import MobileScheduleBottomSheet from './MobileScheduleBottomSheet';
import MobileStatusBottomSheet from './MobileStatusBottomSheet';
import usePatchTask from '@/hooks/TaskPage/Mutate/usePatchTask';
import usePatchTaskStatus from '@/hooks/TaskPage/Mutate/usePatchTaskStatus';
import useGetProjectMemberList from '@/hooks/TaskPage/Query/useGetProjectMemberList';
import useGetTaskList from '@/hooks/TaskPage/Query/useGetTaskList';
import logo from '@assets/icon-mobile-loo.png';
import backButton from '@assets/icon-mobile-leftArrow.svg';
import { toIsoString } from './utils/dateUtils';

const statusStyle: Record<string, string> = {
  '시작 전': 'bg-zinc-200 text-neutral-600',
  '진행 중': 'bg-orange-100 text-neutral-600',
  완료: 'bg-orange-300 text-neutral-700',
};

const formatDateDisplay = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const formatDateDisplayDots = (value?: string) => {
  const base = formatDateDisplay(value);
  return base ? base.replaceAll('-', '.') : '';
};

const TaskDetail = () => {
  const { teamId, taskId } = useParams();
  const projectId = Number(teamId);
  const navigate = useNavigate();

  const resolvedCurrentMemberId = useMemo(() => {
    const stored = localStorage.getItem('memberId');
    const parsed = stored ? Number(stored) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, []);

  const { data: taskList = [] } = useGetTaskList(projectId);
  const { data: projectMembers = [] } = useGetProjectMemberList(projectId);

  const targetTask = taskList.find((t) => String(t.taskId ?? '') === String(taskId ?? ''));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'시작 전' | '진행 중' | '완료'>('시작 전');
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reflection, setReflection] = useState('');

  const [assigneeSheetOpen, setAssigneeSheetOpen] = useState(false);
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [scheduleSheet, setScheduleSheet] = useState<{
    activeField: 'startDate' | 'endDate';
    draftStart: string;
    draftEnd: string;
  } | null>(null);

  const { mutate: patchTask, isPending: isPatchPending } = usePatchTask(projectId, Number(taskId));
  const { mutate: patchStatus, isPending: isStatusPending } = usePatchTaskStatus(projectId);

  const assigneeNameById = useMemo(
    () =>
      projectMembers.reduce<Record<number, string>>((acc, cur) => {
        acc[cur.projectMemberId] = cur.memberName ?? '';
        return acc;
      }, {}),
    [projectMembers],
  );

  useEffect(() => {
    if (!targetTask) return;
    setTitle(targetTask.name ?? '');
    setContent(targetTask.content ?? '');
    setStatus(
      (targetTask.status === 'IN_PROGRESS'
        ? '진행 중'
        : targetTask.status === 'DONE'
          ? '완료'
          : '시작 전') as '시작 전' | '진행 중' | '완료',
    );
    setStartDate(targetTask.startDate ? targetTask.startDate.replaceAll('.', '-') : '');
    setEndDate(targetTask.dueDate ? targetTask.dueDate.replaceAll('.', '-') : '');
    setAssigneeIds(
      Array.isArray(targetTask.assignees)
        ? targetTask.assignees
            .map((a) => a.projectMemberId)
            .filter((id: number) => typeof id === 'number' && Number.isFinite(id))
        : [],
    );
  }, [targetTask]);

  const assigneeNames = assigneeIds
    .map((id) => assigneeNameById[id])
    .filter((name): name is string => Boolean(name));

  const isMyTask = (ids: number[]) => {
    if (resolvedCurrentMemberId === null) return false;
    return ids.includes(resolvedCurrentMemberId);
  };

  const isValid = title.trim() && content.trim() && startDate && endDate;

  const openScheduleSheet = (field: 'startDate' | 'endDate') => {
    setScheduleSheet({
      activeField: field,
      draftStart: startDate,
      draftEnd: endDate,
    });
  };

  const closeAssigneeSheet = () => setAssigneeSheetOpen(false);
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
    const { draftStart, draftEnd } = scheduleSheet;
    setStartDate(draftStart);
    setEndDate(draftEnd);
    closeScheduleSheet();
  };

  const activeScheduleDate = scheduleSheet
    ? new Date(
        scheduleSheet.activeField === 'startDate'
          ? scheduleSheet.draftStart || startDate || new Date().toISOString()
          : scheduleSheet.draftEnd || endDate || new Date().toISOString(),
      )
    : new Date();

  const startDisplay = formatDateDisplayDots(scheduleSheet?.draftStart || startDate);
  const endDisplay = formatDateDisplayDots(scheduleSheet?.draftEnd || endDate);

  const handleSubmit = () => {
    if (!isValid || !taskId) return;

    patchTask(
      {
        name: title.trim(),
        content: content.trim(),
        startDate: toIsoString(startDate),
        dueDate: toIsoString(endDate),
        assigneeProjectMemberIds: assigneeIds,
      },
      {
        onSuccess: () => {
          patchStatus({ taskId: String(taskId), status });
          navigate(-1);
        },
      },
    );
  };

  if (!taskId || !projectId) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-white py-3.5">
      <div className="w-96 max-w-full px-4">
        <div className="flex w-full flex-col items-center">
          <div className="flex h-8 w-80 items-center justify-start gap-6">
            <div className="flex items-center gap-0.5">
              <img src={logo} alt="logo" className="h-8 w-8" />
              <div className="w-40 text-lg font-medium text-orange-500">Connecteamed</div>
            </div>
          </div>

          <div className="flex w-80 flex-col items-start gap-6">
            <img
                src={backButton}
                alt="back button"
                className="h-6 w-6 cursor-pointer"
                onClick={() => navigate(-1)}
              />
            <div className="flex w-full items-center gap-2">
              
              <div className="flex-1 text-2xl font-bold text-black">{title || '업무 제목'}</div>
            </div>

            <div className="flex w-full flex-col items-start gap-6">
              <div className="flex w-full flex-col items-start gap-6">
                <div className="inline-flex items-center gap-10">
                  <div className="text-sm font-medium text-black">상태</div>
                  <button
                    type="button"
                    className={`flex h-6 w-16 items-center justify-center rounded-[20px] px-3.5 py-1.5 text-xs font-medium ${
                      statusStyle[status]
                    }`}
                    onClick={() => setStatusSheetOpen(true)}
                  >
                    {status}
                  </button>
                </div>
                <div className="flex w-full flex-col items-start gap-6">
                  <div className="inline-flex items-center gap-7">
                    <div className="text-sm font-medium text-black">담당자</div>
                    <button
                      type="button"
                      className="text-left text-sm font-normal text-black"
                      onClick={() => setAssigneeSheetOpen(true)}
                    >
                      {assigneeNames.length ? assigneeNames.join(', ') : '담당자 선택'}
                    </button>
                  </div>
                  <div className="inline-flex items-center gap-7">
                    <div className="text-sm font-medium text-black">시작일</div>
                    <button
                      type="button"
                      className="text-sm font-normal text-black"
                      onClick={() => openScheduleSheet('startDate')}
                    >
                      {startDisplay || '시작일 선택'}
                    </button>
                  </div>
                  <div className="inline-flex items-center gap-7">
                    <div className="text-sm font-medium text-black">마감일</div>
                    <button
                      type="button"
                      className="text-sm font-normal text-black"
                      onClick={() => openScheduleSheet('endDate')}
                    >
                      {endDisplay || '마감일 선택'}
                    </button>
                  </div>
                </div>

                <div className="flex w-full flex-col items-start gap-3">
                  <div className="flex w-full flex-col items-start gap-3">
                    <div className="text-sm font-medium text-black">업무내용</div>
                    <div className="inline-flex h-20 w-full items-center gap-2.5 rounded-[10px] px-4 py-4 outline outline-1 outline-offset-[-1px] outline-gray-300">
                      <textarea
                        className="h-12 w-full resize-none text-sm text-black"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                  {isMyTask(assigneeIds) && (
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="text-sm font-medium text-black">내 성과 및 느낀점</div>
                      <div className="inline-flex h-32 w-full items-center gap-2.5 rounded-[10px] px-4 py-4 outline outline-1 outline-offset-[-1px] outline-gray-300">
                        <textarea
                          className="h-24 w-full resize-none text-sm text-black placeholder:text-gray-400"
                          value={reflection}
                          placeholder="이번 업무에서 특별히 신경 쓴 부분, 해결한 문제, 혹은 아쉬웠던 점을 자유롭게 적어주세요. (예: API 속도 이슈 해결, 디자인 팀과의 소통 원활 등)"
                          onChange={(e) => setReflection(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full text-[8px] font-medium text-black">
                해당 내용은 나에게만 보이고 최종 회고에 쓰일 내용이에요
              </div>
            </div>

            <button
              type="button"
              className={`inline-flex h-10 w-full items-center justify-center gap-2.5 rounded-[5px] px-24 py-4 text-base font-medium text-white ${
                isValid ? 'bg-orange-500' : 'bg-gray-300'
              }`}
              onClick={handleSubmit}
              disabled={!isValid || isPatchPending || isStatusPending}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>

      <MobileAssigneeBottomSheet
        isOpen={assigneeSheetOpen}
        members={projectMembers}
        selectedIds={assigneeIds}
        onToggle={(id) => {
          setAssigneeIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
          );
        }}
        onSave={closeAssigneeSheet}
        onClose={closeAssigneeSheet}
      />

      <MobileScheduleBottomSheet
        isOpen={Boolean(scheduleSheet)}
        activeField={scheduleSheet?.activeField ?? 'startDate'}
        startDisplay={startDisplay}
        endDisplay={endDisplay}
        activeDate={activeScheduleDate}
        onSelectTab={handleScheduleTab}
        onPickDate={handleSelectScheduleDate}
        onSave={handleSaveScheduleSheet}
        onClose={closeScheduleSheet}
        isSaveDisabled={!scheduleSheet}
      />

      <MobileStatusBottomSheet
        isOpen={statusSheetOpen}
        currentStatus={status}
        onClose={() => setStatusSheetOpen(false)}
        onSave={(nextStatus) => {
          setStatus(nextStatus);
          setStatusSheetOpen(false);
        }}
      />
    </div>
  );
};

export default TaskDetail;
