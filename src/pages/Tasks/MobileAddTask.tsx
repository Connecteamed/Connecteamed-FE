import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MobileAssigneeBottomSheet from './components/TaskManagement/MobileAssigneeBottomSheet';
import MobileScheduleBottomSheet from './components/TaskManagement/MobileScheduleBottomSheet';
import useGetProjectMemberList from '@/hooks/TaskPage/Query/useGetProjectMemberList';
import usePostTask from '@/hooks/TaskPage/Mutate/usePostTask';
import logo from '@assets/icon-mobile-loo.png';
import backButton from '@assets/icon-mobile-leftArrow.svg';
import { toIsoString } from './components/TaskManagement/utils/dateUtils';

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

const MobileAddTask = () => {
  const { teamId } = useParams();
  const projectId = Number(teamId);
  const navigate = useNavigate();
  const { data: projectMembers = [] } = useGetProjectMemberList(projectId);
  const { mutate: postTask, isPending } = usePostTask(projectId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assigneeSheetOpen, setAssigneeSheetOpen] = useState(false);
  const [scheduleSheet, setScheduleSheet] = useState<{
    activeField: 'startDate' | 'endDate';
    draftStart: string;
    draftEnd: string;
  } | null>(null);

  const isValid = title.trim() && content.trim() && startDate && endDate;

  const assigneeNameById = useMemo(
    () =>
      projectMembers.reduce<Record<number, string>>((acc, cur) => {
        acc[cur.projectMemberId] = cur.memberName ?? '';
        return acc;
      }, {}),
    [projectMembers],
  );

  const assigneeNames = assigneeIds
    .map((id) => assigneeNameById[id])
    .filter((name): name is string => Boolean(name));

  const openAssigneeSheet = () => setAssigneeSheetOpen(true);
  const closeAssigneeSheet = () => setAssigneeSheetOpen(false);

  const toggleAssignee = (projectMemberId: number) => {
    setAssigneeIds((prev) =>
      prev.includes(projectMemberId)
        ? prev.filter((id) => id !== projectMemberId)
        : [...prev, projectMemberId],
    );
  };

  const openScheduleSheet = (field: 'startDate' | 'endDate') => {
    setScheduleSheet({
      activeField: field,
      draftStart: startDate,
      draftEnd: endDate,
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
    if (!isValid || !projectId) return;
    const payload = {
      name: title.trim(),
      content: content.trim(),
      startDate: toIsoString(startDate),
      dueDate: toIsoString(endDate),
      assigneeProjectMemberIds: assigneeIds,
    };

    postTask(payload, {
      onSuccess: () => {
        navigate(-1);
      },
    });
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-white py-3.5">
      <div className="w-96 max-w-full px-4">
        <div className="flex w-full flex-col items-center">
          <div className="flex h-8 w-[343px] items-center justify-start gap-6">
            <div className="flex items-center gap-0.5">
              <img src={logo} alt="logo" className="h-6 w-6" />
              <div className="w-40 text-lg font-medium text-orange-500">Connecteamed</div>
            </div>
          </div>

          <div className="flex w-[343px] flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start gap-6">
              <img src={backButton} alt="back button" className="h-6 w-6 cursor-pointer" onClick={() => navigate(-1)} />
              <div className="h-10 w-full text-lg font-medium text-black">업무추가</div>

              <div className="flex w-full flex-col items-start gap-3">
                <div className="text-sm font-medium text-black">업무명</div>
                <input
                  className="h-7 w-full rounded-[5px] border border-gray-300 px-2.5 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex w-full flex-col items-start gap-3">
                <div className="text-sm font-medium text-black">담당자</div>
                <button
                  type="button"
                  className="flex h-7 w-full items-center rounded-[5px] border border-gray-300 px-2.5 text-left text-sm"
                  onClick={openAssigneeSheet}
                >
                  {assigneeNames.length ? assigneeNames.join(', ') : '담당자 선택'}
                </button>
              </div>

              <div className="flex h-14 w-full items-center justify-start gap-8">
                <div className="inline-flex w-40 flex-col items-start justify-start gap-3">
                  <div className="text-sm font-medium text-black">시작일</div>
                  <button
                    type="button"
                    className="flex h-7 w-full items-center rounded-[5px] border border-gray-300 px-2.5 text-left text-sm"
                    onClick={() => openScheduleSheet('startDate')}
                  >
                    {formatDateDisplay(startDate) || '시작일 선택'}
                  </button>
                </div>
                <div className="inline-flex w-40 flex-col items-start justify-start gap-3">
                  <div className="text-sm font-medium text-black">마감일</div>
                  <button
                    type="button"
                    className="flex h-7 w-full items-center rounded-[5px] border border-gray-300 px-2.5 text-left text-sm"
                    onClick={() => openScheduleSheet('endDate')}
                  >
                    {formatDateDisplay(endDate) || '마감일 선택'}
                  </button>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-3">
                <div className="text-sm font-medium text-black">업무내용</div>
                <textarea
                  className="h-64 w-full rounded-[5px] border border-gray-300 px-2.5 py-2 text-sm"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className={`inline-flex h-10 w-full items-center justify-center gap-2.5 rounded-[5px] px-24 py-4 text-base font-medium text-white ${
                isValid ? 'bg-orange-500' : 'bg-gray-300'
              }`}
              onClick={handleSubmit}
              disabled={!isValid || isPending}
            >
              생성하기
            </button>
          </div>
        </div>
      </div>

      <MobileAssigneeBottomSheet
        isOpen={assigneeSheetOpen}
        members={projectMembers}
        selectedIds={assigneeIds}
        onToggle={toggleAssignee}
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
    </div>
  );
};

export default MobileAddTask;
