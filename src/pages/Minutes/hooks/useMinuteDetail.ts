import { useEffect, useState } from 'react';

import { getMinuteDetail } from '@/apis/minutes';
import type { MinuteAgenda, MinuteAttendee } from '@/types/minutes';

import type { AttendeeOption } from '../components/AttendeeSelector';
import {
  type AgendaFormItem,
  formatDisplayDate,
  getAttendeeId,
  getAttendeeName,
  mapDetailAgendasToForm,
} from './minutes.utils';

type DetailSetter = {
  setTitle: (v: string) => void;
  setSelectedDate: (d: Date) => void;
  setDateStr: (s: string) => void;
  setSelectedAttendeeIds: (ids: number[]) => void;
  setDetailAttendeeOptions: (opts: AttendeeOption[]) => void;
  setAgendas: (agendas: AgendaFormItem[]) => void;
};

export const useMinuteDetail = (isEditMode: boolean, meetingId: number, setters: DetailSetter) => {
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

        setters.setTitle(detail.title ?? '');

        let date = new Date(detail.meetingDate);

        if (Number.isNaN(date.getTime()) && typeof detail.meetingDate === 'string') {
          date = new Date(detail.meetingDate.replace(' ', 'T'));
        }

        if (!Number.isNaN(date.getTime())) {
          setters.setSelectedDate(date);
          setters.setDateStr(formatDisplayDate(date));
        } else if (typeof detail.meetingDate === 'string') {
          const match = detail.meetingDate.match(/^(\d{4})[-.](\d{2})[-.](\d{2})/);
          if (match) {
            const [, y, m, d] = match;
            setters.setDateStr(`${y}.${m}.${d}`);
            setters.setSelectedDate(new Date(Number(y), Number(m) - 1, Number(d)));
          }
        }

        const attendees: MinuteAttendee[] = detail.attendees ?? [];
        const attendeeIds = attendees.map(getAttendeeId).filter((id) => id > 0);
        setters.setSelectedAttendeeIds(attendeeIds);

        const attendeeOptions: AttendeeOption[] = attendees
          .map((attendee) => ({ id: getAttendeeId(attendee), name: getAttendeeName(attendee) }))
          .filter((item) => item.id > 0 && item.name.length > 0);

        setters.setDetailAttendeeOptions(attendeeOptions);

        const agendas = mapDetailAgendasToForm(detail.agendas as MinuteAgenda[]);
        setters.setAgendas(agendas);
      } catch {
        setErrorMessage('회의록 상세를 불러오지 못했습니다.');
      } finally {
        setIsDetailLoading(false);
      }
    };

    void fetchDetail();
  }, [isEditMode, meetingId]);

  return { isDetailLoading, errorMessage, setErrorMessage };
};
