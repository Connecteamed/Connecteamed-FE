import { useMemo } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Input from '@/components/Input';
import Calender from '@/components/calender';

import backIcon from '@/assets/icon-back-black.svg';
import deleteIcon from '@/assets/icon-delete.svg';

import AttendeeSelector, { type AttendeeOption } from './components/AttendeeSelector';
import { useMinuteDetail } from './hooks/useMinuteDetail';
import { useMinutesForm } from './hooks/useMinutesForm';

interface MinutesPageLocationState {
  memberOptions?: AttendeeOption[];
  meetingId?: number;
}

const MinutesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams();
  const projectId = Number(teamId);

  const state = (location.state as MinutesPageLocationState | null) ?? null;
  const meetingId = Number(state?.meetingId);
  const isEditMode = Number.isFinite(meetingId) && meetingId > 0;

  const memberOptionsFromState = useMemo(() => state?.memberOptions ?? [], [state?.memberOptions]);

  const form = useMinutesForm({ projectId, meetingId, isEditMode, memberOptionsFromState });

  const detail = useMinuteDetail(isEditMode, meetingId, {
    setTitle: form.setTitle,
    setSelectedDate: form.setSelectedDate,
    setDateStr: form.setDateStr,
    setSelectedAttendeeIds: form.setSelectedAttendeeIds,
    setDetailAttendeeOptions: form.setDetailAttendeeOptions,
    setAgendas: form.setAgendas,
  });

  const errorMessage = form.errorMessage || detail.errorMessage;
  const isDetailLoading = detail.isDetailLoading;

  return (
    <div className="h-full w-full overflow-y-auto bg-white px-11 py-14">
      <div className="mb-8 flex w-full justify-start">
        <button 
          onClick={() => navigate(`/team/${projectId}`, { state: { selectedTask: '3' } })} 
          className="py-2 pr-4"
        >
          <img className="w-4" src={backIcon} alt="뒤로가기" />
        </button>
      </div>

      <div className="w-full space-y-6">
        {isDetailLoading && (
          <div className="rounded-md px-4 py-2 text-sm text-neutral-700">
            회의록 상세를 불러오는 중입니다...
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-lg font-medium">회의명</label>
          <Input
            placeholder="회의명을 입력하세요"
            value={form.title}
            onChange={(e) => form.setTitle(e.target.value)}
          />
        </div>

        <AttendeeSelector
          options={form.memberOptions}
          selectedAttendeeIds={form.selectedAttendeeIds}
          onSelectionChange={form.setSelectedAttendeeIds}
        />

        <div className="relative space-y-3">
          <label className="block text-lg font-medium">회의 날짜</label>

          <div onClick={() => form.setIsCalendarOpen((p) => !p)} className="cursor-pointer">
            <Input
              type="text"
              placeholder="회의 날짜를 선택하세요"
              value={form.dateStr}
              readOnly
              className="cursor-pointer bg-white caret-transparent"
            />
          </div>

          {form.isCalendarOpen && (
            <div className="absolute top-21.25 left-0 z-20">
              <Calender
                prev={form.selectedDate}
                next={form.handleDateSelect}
                onClose={() => form.setIsCalendarOpen(false)}
              />
            </div>
          )}
        </div>

        {form.agendas.map((agenda, index) => (
          <div key={`${agenda.id ?? 'new'}-${index}`} className="relative space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-medium">안건 {index + 1}</label>
              {form.agendas.length > 1 && (
                <button
                  onClick={() => form.handleDeleteAgenda(index)}
                  className="p-1 hover:opacity-70 transition-opacity"
                >
                  <img src={deleteIcon} alt="안건 삭제" className="w-5" />
                </button>
              )}
            </div>

            <Input
              placeholder="안건을 입력하세요"
              value={agenda.title}
              onChange={(e) => form.handleAgendaChange(index, 'title', e.target.value)}
            />

            <textarea
              className="placeholder:text-neutral-60 h-40 w-full resize-none rounded-xl bg-white px-3.5 py-3 text-lg font-medium outline-1 -outline-offset-1 outline-neutral-50 transition-all focus:placeholder:text-transparent focus:outline-orange-500"
              placeholder="내용을 입력하세요"
              value={agenda.content}
              onChange={(e) => form.handleAgendaChange(index, 'content', e.target.value)}
            />
          </div>
        ))}

        {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

        <div className="mt-8 flex flex-col items-center gap-12">
          <button
            onClick={form.handleAddAgenda}
            disabled={!form.isLastAgendaFilled}
            className={`h-14 w-96 rounded-md text-base font-bold transition-colors ${
              form.isLastAgendaFilled
                ? 'bg-orange-500 text-white'
                : 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
            }`}
          >
            안건 추가하기
          </button>

          <button
            onClick={form.handleSave}
            disabled={!form.canSave || form.isSaving || isDetailLoading}
            className={`h-14 w-96 rounded-md text-base font-bold transition-colors ${
              form.canSave && !form.isSaving && !isDetailLoading
                ? 'bg-orange-500 text-white'
                : 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {form.isSaving ? '저장 중...' : isEditMode ? '수정하기' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinutesPage;
