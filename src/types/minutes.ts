import type { ApiResponse } from './api';

// 목록 아이템
export interface MinuteListItem {
  minuteId: number;
  title: string;
  attendees: string[];
  meetingDate: string;
}

export interface GetMinutesData {
  minutes: MinuteListItem[];
}

// 생성 요청
export interface CreateAgendaRequest {
  title: string;
  content: string;
  sortOrder: number;
}

export interface CreateMinuteRequest {
  title: string;
  meetingDate: string;
  attendeeIds: number[];
  agendas: CreateAgendaRequest[];
}

// 생성 응답
export interface CreateMinuteData {
  minuteId: number;
  createdAt: string;
}

// 상세 조회
export interface MinuteAttendee {
  id: number;
  nickname: string;
  role: string;
}

export interface MinuteAgenda {
  agendaId: number;
  title: string;
  content: string;
}

export interface GetMinuteDetailData {
  minuteId: number;
  title: string;
  meetingDate: string;
  attendees: MinuteAttendee[];
  agendas: MinuteAgenda[];
}

export type GetMinutesResponse = ApiResponse<GetMinutesData>;
export type CreateMinuteResponse = ApiResponse<CreateMinuteData>;
export type GetMinuteDetailResponse = ApiResponse<GetMinuteDetailData>;
export type DeleteMinuteResponse = ApiResponse<null>;
