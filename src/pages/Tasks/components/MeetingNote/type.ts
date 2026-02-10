// types.ts
export interface Meeting {
  id: string | number;
  title: string;
  members: string;
  date: string;
  content?: string;
}

export type MeetingFormData = Omit<Meeting, 'id'>;
