import { useEffect, useMemo, useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getMinuteDetail, patchMinute, postMinute } from '@/apis/minutes';
import type {
  CreateMinuteRequest,
  MinuteAgenda,
  MinuteAttendee,
  UpdateMinuteRequest,
} from '@/types/minutes';

import Input from '@/components/Input';
import Calender from '@/components/calender';

import backIcon from '@/assets/icon-back-black.svg';

import AttendeeSelector, { type AttendeeOption } from './components/AttendeeSelector';

interface Agenda {
  id?: number;
  title: string;
  content: string;
}

interface MinutesPageLocationState {
  memberOptions?: AttendeeOption[];
  meetingId?: number;
}

const formatDisplayDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

// PATCH /meetings/{meetingId} uses IDs that match detail.attendees[].id.
const getAttendeeId = (attendee: MinuteAttendee) => attendee.id ?? attendee.attendeeId ?? 0;
const getAttendeeName = (attendee: MinuteAttendee) => attendee.name ?? attendee.nickname ?? '';

const MinutesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams();
  const projectId = Number(teamId);

  const state = (location.state as MinutesPageLocationState | null) ?? null;
  const meetingId = Number(state?.meetingId);
  const isEditMode = Number.isFinite(meetingId) && meetingId > 0;
  const memberOptionsFromState = useMemo(() => state?.memberOptions ?? [], [state?.memberOptions]);

  const [title, setTitle] = useState('');
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<number[]>([]);
  const [detailAttendeeOptions, setDetailAttendeeOptions] = useState<AttendeeOption[]>([]);
  const [dateStr, setDateStr] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [agendas, setAgendas] = useState<Agenda[]>([{ title: '', content: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const memberOptions = useMemo(() => {
    const map = new Map<number, string>();
    memberOptionsFromState.forEach((item) => map.set(item.id, item.name));
    detailAttendeeOptions.forEach((item) => map.set(item.id, item.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [detailAttendeeOptions, memberOptionsFromState]);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchDetail = async () => {
      try {
        setIsDetailLoading(true);
        setErrorMessage('');
        const res = await getMinuteDetail(meetingId);
        if (res.status !== 'success' || !res.data) {
          setErrorMessage(res.message ?? '회의록 상세를 불러오지 못했습니다.');
          return;
        }

        const detail = res.data;
        setTitle(detail.title ?? '');

        const date = new Date(detail.meetingDate);
        if (!Number.isNaN(date.getTime())) {
          setSelectedDate(date);
          setDateStr(formatDisplayDate(date));
        }

        const attendees = detail.attendees ?? [];
        const attendeeIds = attendees.map(getAttendeeId).filter((id) => id > 0);
        setSelectedAttendeeIds(attendeeIds);
        setDetailAttendeeOptions(
          attendees
            .map((attendee) => ({
              id: getAttendeeId(attendee),
              name: getAttendeeName(attendee),
            }))
            .filter((item) => item.id > 0 && item.name.length > 0),
        );

        const detailAgendas = (detail.agendas ?? []).map((agenda: MinuteAgenda) => {
          const rawTitle = agenda.title ?? '';
          const rawContent = agenda.content ?? '';

          // Legacy-created meetings may store "title\ncontent" in title with empty content.
          if (!rawContent && rawTitle.includes('\n')) {
            const [nextTitle, ...contentParts] = rawTitle.split('\n');
            return {
              id: agenda.id ?? agenda.agendaId,
              title: nextTitle ?? '',
              content: contentParts.join('\n'),
            };
          }

          return {
            id: agenda.id ?? agenda.agendaId,
            title: rawTitle,
            content: rawContent,
          };
        });
        setAgendas(detailAgendas.length > 0 ? detailAgendas : [{ title: '', content: '' }]);
      } catch {
        setErrorMessage('회의록 상세를 불러오지 못했습니다.');
      } finally {
        setIsDetailLoading(false);
      }
    };

    void fetchDetail();
  }, [isEditMode, meetingId]);

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

    const normalizedAttendeeIds = Array.from(
      new Set(
        selectedAttendeeIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0),
      ),
    );

    if (normalizedAttendeeIds.length === 0) {
      setErrorMessage('참석자를 1명 이상 선택해주세요.');
      return;
    }

    const normalizedAgendas = agendas
      .map((agenda, index) => ({
        id: agenda.id,
        title: agenda.title.trim(),
        content: agenda.content.trim(),
        sortOrder: index,
      }))
      .filter((agenda) => agenda.title.length > 0 || agenda.content.length > 0);

    if (normalizedAgendas.length === 0) {
      setErrorMessage('안건을 1개 이상 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');

      if (isEditMode) {
        const updatePayload: UpdateMinuteRequest = {
          title: title.trim(),
          meetingDate: selectedDate.toISOString(),
          attendeeIds: normalizedAttendeeIds,
          agendas: normalizedAgendas.map((agenda, index) => ({
            id: Number(agenda.id) > 0 ? Number(agenda.id) : 0,
            title: agenda.title,
            content: agenda.content,
            sortOrder: index,
          })),
        };

        const res = await patchMinute(meetingId, updatePayload);
        if (res.status !== 'success') {
          setErrorMessage(res.message ?? '회의록 수정에 실패했습니다.');
          return;
        }
      } else {
        const createPayload: CreateMinuteRequest = {
          projectId,
          title: title.trim(),
          meetingDate: selectedDate.toISOString(),
          attendeeIds: normalizedAttendeeIds,
          agendas: normalizedAgendas.map((agenda) =>
            agenda.title && agenda.content
              ? `${agenda.title}\n${agenda.content}`
              : agenda.title || agenda.content,
          ),
        };

        const res = await postMinute(projectId, createPayload);
        if (res.status !== 'success') {
          setErrorMessage(res.message ?? '회의록 저장에 실패했습니다.');
          return;
        }
      }

      navigate(`/team/${projectId}`, { state: { selectedTask: '3' } });
    } catch {
      setErrorMessage(isEditMode ? '회의록 수정에 실패했습니다.' : '회의록 저장에 실패했습니다.');
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
        {isDetailLoading && (
          <div className="rounded-md bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
            회의록 상세를 불러오는 중입니다...
          </div>
        )}

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
          <div key={`${agenda.id ?? 'new'}-${index}`} className="space-y-3 pt-2">
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
            disabled={isSaving || isDetailLoading}
            className="bg-primary-500 h-14 w-96 rounded-md text-base font-bold text-white disabled:opacity-60"
          >
            {isSaving ? '저장 중...' : isEditMode ? '수정하기' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinutesPage;
