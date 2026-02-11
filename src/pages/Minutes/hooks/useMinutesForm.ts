import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { patchMinute, postMinute } from '@/apis/minutes';
import type { CreateMinuteRequest, UpdateMinuteRequest } from '@/types/minutes';

import useGetProjectMemberList from '@/hooks/TaskPage/Query/useGetProjectMemberList';

import type { AttendeeOption } from '../components/AttendeeSelector';
import { type AgendaFormItem, formatDateForApi, formatDisplayDate } from './minutes.utils';

type Params = {
  projectId: number;
  meetingId: number;
  isEditMode: boolean;
  memberOptionsFromState: AttendeeOption[];
};

export const useMinutesForm = ({
  projectId,
  meetingId,
  isEditMode,
  memberOptionsFromState,
}: Params) => {
  const navigate = useNavigate();

  const { data: projectMembers } = useGetProjectMemberList(projectId);

  const [title, setTitle] = useState('');
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<number[]>([]);
  const [detailAttendeeOptions, setDetailAttendeeOptions] = useState<AttendeeOption[]>([]);
  const [dateStr, setDateStr] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [agendas, setAgendas] = useState<AgendaFormItem[]>([{ title: '', content: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!projectMembers || projectMembers.length === 0) return;

    let needsUpdate = false;
    const idMap = new Map<number, number>();

    const newDetailOptions = detailAttendeeOptions.map((option) => {
      const matched = projectMembers.find((pm) => pm.memberName === option.name);
      // 이름이 같고 ID가 다른 경우 업데이트 필요
      if (matched && matched.projectMemberId !== option.id) {
        idMap.set(option.id, matched.projectMemberId);
        needsUpdate = true;
        return { ...option, id: matched.projectMemberId };
      }
      return option;
    });

    if (needsUpdate) {
      setDetailAttendeeOptions(newDetailOptions);
      setSelectedAttendeeIds((prev) => {
        // 선택된 ID들도 새로운 ID로 매핑, 매핑 안 되면 그대로 유지
        // 중복 선택 방지를 위해 Set 사용
        const newIds = prev.map((id) => idMap.get(id) ?? id);
        return Array.from(new Set(newIds));
      });
    }
  }, [projectMembers, detailAttendeeOptions]);

  const memberOptions = useMemo(() => {
    const map = new Map<number, string>();
    memberOptionsFromState.forEach((item) => map.set(item.id, item.name));
    detailAttendeeOptions.forEach((item) => map.set(item.id, item.name));
    projectMembers?.forEach((member) => map.set(member.projectMemberId, member.memberName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [detailAttendeeOptions, memberOptionsFromState, projectMembers]);

  const handleAddAgenda = () => setAgendas((prev) => [...prev, { title: '', content: '' }]);

  const handleAgendaChange = (index: number, field: keyof AgendaFormItem, value: string) => {
    setAgendas((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
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
      .map((a, index) => ({
        id: a.id,
        title: a.title.trim(),
        content: a.content.trim(),
        sortOrder: index,
      }))
      .filter((a) => a.title.length > 0 || a.content.length > 0);

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
          meetingDate: formatDateForApi(selectedDate),
          attendeeIds: normalizedAttendeeIds,
          agendas: normalizedAgendas.map((a, index) => ({
            id: Number(a.id) > 0 ? Number(a.id) : 0,
            title: a.title,
            content: a.content,
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
          meetingDate: formatDateForApi(selectedDate),
          attendeeMemberIds: normalizedAttendeeIds,
          agendas: normalizedAgendas.map((a, index) => ({
            title: a.title,
            content: a.content,
            sortOrder: index,
          })),
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

  return {
    // state
    title,
    selectedAttendeeIds,
    detailAttendeeOptions,
    memberOptions,
    dateStr,
    selectedDate,
    isCalendarOpen,
    agendas,
    isSaving,
    errorMessage,

    setTitle,
    setSelectedAttendeeIds,
    setDetailAttendeeOptions,
    setDateStr,
    setSelectedDate,
    setIsCalendarOpen,
    setAgendas,
    setErrorMessage,

    handleAddAgenda,
    handleAgendaChange,
    handleDateSelect,
    handleSave,
  };
};
