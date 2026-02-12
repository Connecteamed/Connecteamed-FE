import type { ApiResponse } from './api';

export interface MinuteListAttendee {
  attendeeId?: number;
  id?: number;
  name?: string;
  nickname?: string;
}

export interface MinuteListItem {
  meetingId?: number;
  minuteId?: number;
  title: string;
  attendees: Array<MinuteListAttendee | string>;
  meetingDate: string;
}

export interface GetMinutesData {
  meetings?: MinuteListItem[];
  minutes?: MinuteListItem[];
}

export interface CreateMinuteRequest {
  projectId: number;
  title: string;
  meetingDate: string;
  attendeeMemberIds: number[];
  agendas: CreateMinuteAgendaRequest[];
}

export interface CreateMinuteAgendaRequest {
  title: string;
  content: string;
  sortOrder: number;
}

export interface CreateMinuteData {
  minuteId: number;
  createdAt: string;
}

export interface MinuteAttendee {
  attendeeId?: number;
  id?: number;
  name?: string;
  nickname?: string;
  role?: string;
}

export interface MinuteAgenda {
  id?: number;
  agendaId?: number;
  title: string;
  content: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetMinuteDetailData {
  meetingId: number;
  projectId: number;
  title: string;
  meetingDate: string;
  createdAt?: string;
  updatedAt?: string;
  attendees: MinuteAttendee[];
  agendas: MinuteAgenda[];
}

export interface UpdateMinuteAgendaRequest {
  id?: number;
  title: string;
  content: string;
  sortOrder: number;
}

export interface UpdateMinuteRequest {
  title: string;
  meetingDate: string;
  attendeeIds: number[];
  agendas: UpdateMinuteAgendaRequest[];
}

export type GetMinutesResponse = ApiResponse<GetMinutesData>;
export type CreateMinuteResponse = ApiResponse<CreateMinuteData>;
export type GetMinuteDetailResponse = ApiResponse<GetMinuteDetailData>;
export type UpdateMinuteResponse = ApiResponse<null>;
export type DeleteMinuteResponse = ApiResponse<null>;
