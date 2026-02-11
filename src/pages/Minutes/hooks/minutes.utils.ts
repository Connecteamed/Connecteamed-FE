import type { MinuteAgenda, MinuteAttendee } from '@/types/minutes';

export interface AgendaFormItem {
  id?: number;
  title: string;
  content: string;
}

export const formatDisplayDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

// PATCH /meetings/{meetingId} uses IDs that match detail.attendees[].attendeeId (ProjectMemberId).
export const getAttendeeId = (attendee: MinuteAttendee) => attendee.attendeeId ?? attendee.id ?? 0;
export const getAttendeeName = (attendee: MinuteAttendee) =>
  attendee.name ?? attendee.nickname ?? '';

export const formatDateForApi = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString();
};

export const mapDetailAgendasToForm = (detailAgendas: MinuteAgenda[] = []): AgendaFormItem[] => {
  const mapped = detailAgendas.map((agenda) => {
    const rawTitle = agenda.title ?? '';
    const rawContent = agenda.content ?? '';

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

  return mapped.length > 0 ? mapped : [{ title: '', content: '' }];
};
