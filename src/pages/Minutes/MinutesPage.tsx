import { useMemo, useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { postMinute } from '@/apis/minutes';
import type { CreateMinuteRequest } from '@/types/minutes';

import Input from '@/components/Input';
import Calender from '@/components/calender';

import backIcon from '@/assets/icon-back-black.svg';

import AttendeeSelector, { type AttendeeOption } from './components/AttendeeSelector';

interface Agenda {
  title: string;
  content: string;
}

interface MinutesPageLocationState {
  memberOptions?: AttendeeOption[];
}

const formatDisplayDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const formatApiDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const MinutesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams();
  const projectId = Number(teamId);

  const state = location.state as MinutesPageLocationState | null;
  const memberOptions = useMemo(() => state?.memberOptions ?? [], [state?.memberOptions]);

  const [title, setTitle] = useState('');
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<number[]>([]);
  const [dateStr, setDateStr] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [agendas, setAgendas] = useState<Agenda[]>([{ title: '', content: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddAgenda = () => {
    setAgendas((prev) => [...prev, { title: '', content: '' }]);
  };

  const handleAgendaChange = (index: number, field: keyof Agenda, value: string) => {
    setAgendas((prev) =>
      prev.map((agenda, i) => (i === index ? { ...agenda, [field]: value } : agenda)),
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDateStr(formatDisplayDate(date));
    setIsCalendarOpen(false);
  };

  const handleSave = async () => {
    if (!Number.isFinite(projectId)) {
      setErrorMessage('유효한 팀 정보가 없습니다.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('회의명을 입력해주세요.');
      return;
    }

    if (!dateStr) {
      setErrorMessage('회의 날짜를 선택해주세요.');
      return;
    }

    const validAgendas = agendas
      .map((agenda, index) => ({
        title: agenda.title.trim(),
        content: agenda.content.trim(),
        sortOrder: index + 1,
      }))
      .filter((agenda) => agenda.title.length > 0 || agenda.content.length > 0);

    if (validAgendas.length === 0) {
      setErrorMessage('안건을 1개 이상 입력해주세요.');
      return;
    }

    const payload: CreateMinuteRequest = {
      title: title.trim(),
      meetingDate: formatApiDate(selectedDate),
      attendeeIds: selectedAttendeeIds,
      agendas: validAgendas,
    };

    try {
      setIsSaving(true);
      setErrorMessage('');
      const res = await postMinute(projectId, payload);

      if (res.status !== 'success') {
        setErrorMessage(res.message ?? '회의록 저장에 실패했습니다.');
        return;
      }

      navigate(`/team/${projectId}`, { state: { selectedTask: '3' } });
    } catch {
      setErrorMessage('회의록 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white px-11 py-14">
      <div className="mb-8 flex w-full justify-start">
        <button onClick={() => navigate(-1)} className="py-2 pr-4">
          <img className="w-4" src={backIcon} alt="뒤로가기" />
        </button>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-3">
          <label className="block text-lg font-medium">회의명</label>
          <Input
            placeholder="회의명을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <AttendeeSelector
          options={memberOptions}
          selectedAttendeeIds={selectedAttendeeIds}
          onSelectionChange={setSelectedAttendeeIds}
        />

        <div className="relative space-y-3">
          <label className="block text-lg font-medium">회의 날짜</label>
          <div onClick={() => setIsCalendarOpen((prev) => !prev)} className="cursor-pointer">
            <Input
              type="text"
              placeholder="회의 날짜를 선택하세요"
              value={dateStr}
              readOnly
              className="cursor-pointer bg-white caret-transparent"
            />
          </div>

          {isCalendarOpen && (
            <div className="absolute top-21.25 left-0 z-20">
              <Calender
                prev={selectedDate}
                next={handleDateSelect}
                onClose={() => setIsCalendarOpen(false)}
              />
            </div>
          )}
        </div>

        {agendas.map((agenda, index) => (
          <div key={index} className="space-y-3 pt-2">
            <label className="block text-lg font-medium">안건 {index + 1}</label>

            <Input
              placeholder="안건을 입력하세요"
              value={agenda.title}
              onChange={(e) => handleAgendaChange(index, 'title', e.target.value)}
            />

            <textarea
              className="placeholder:text-neutral-60 h-40 w-full resize-none rounded-xl bg-white px-3.5 py-3 text-lg font-medium outline-1 -outline-offset-1 outline-neutral-50"
              placeholder="내용을 입력하세요"
              value={agenda.content}
              onChange={(e) => handleAgendaChange(index, 'content', e.target.value)}
            />
          </div>
        ))}

        {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

        <div className="mt-8 flex flex-col items-center gap-12">
          <button
            onClick={handleAddAgenda}
            className="h-14 w-96 rounded-md bg-neutral-50 text-base font-bold text-white"
          >
            안건 추가하기
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary-500 h-14 w-96 rounded-md text-base font-bold text-white disabled:opacity-60"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinutesPage;
