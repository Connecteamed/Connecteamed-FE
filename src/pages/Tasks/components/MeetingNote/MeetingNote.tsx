import { useCallback, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { deleteMinute, getMinutes } from '@/apis/minutes';

import DeleteModal from '@/components/DeleteModal';

import EmptyMeeting from './EmptyMeeting';
import MeetingList from './MeetingList';
import type { Meeting } from './type';

interface MeetingNoteProps {
  newMeeting?: Meeting;
  memberOptions?: Array<{ id: number; name: string }>;
}

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const MeetingNote = ({ memberOptions = [] }: MeetingNoteProps) => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const projectId = Number(teamId);

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [meetingIdToDelete, setMeetingIdToDelete] = useState<Meeting['id'] | null>(null);

  const fetchMeetings = useCallback(async () => {
    if (!Number.isFinite(projectId)) return;

    try {
      setLoading(true);
      setErrorMessage('');
      const res = await getMinutes(projectId);

      const nextMeetings =
        res.status === 'success'
          ? (res.data?.minutes ?? []).map((minute) => ({
              id: minute.minuteId,
              title: minute.title,
              members: (minute.attendees ?? []).join(', '),
              date: formatDate(minute.meetingDate),
            }))
          : [];
      setMeetings(nextMeetings);
    } catch {
      setErrorMessage('회의록 목록을 불러오지 못했습니다.');
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void fetchMeetings();
  }, [fetchMeetings]);

  const handleCreateClick = () => {
    if (!Number.isFinite(projectId)) return;
    navigate(`/team/${projectId}/minutes`, { state: { memberOptions } });
  };

  const handleDelete = (id: Meeting['id']) => {
    setMeetingIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (meetingIdToDelete === null) return;

    try {
      await deleteMinute(Number(meetingIdToDelete));
      setMeetings((prev) => prev.filter((m) => m.id !== meetingIdToDelete));
    } catch {
      setErrorMessage('회의록 삭제에 실패했습니다.');
    } finally {
      setIsDeleteModalOpen(false);
      setMeetingIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMeetingIdToDelete(null);
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="py-8 text-center text-sm text-neutral-500">
          회의록을 불러오는 중입니다...
        </div>
      ) : meetings.length === 0 ? (
        <>
          {errorMessage && <div className="pb-3 text-sm text-red-500">{errorMessage}</div>}
          <EmptyMeeting onCreate={handleCreateClick} />
        </>
      ) : (
        <>
          {errorMessage && <div className="pb-3 text-sm text-red-500">{errorMessage}</div>}
          <MeetingList meetings={meetings} onCreate={handleCreateClick} onDelete={handleDelete} />
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={cancelDelete}
            onConfirm={confirmDelete}
            title="회의록 삭제"
            description="해당 회의록을 삭제할까요?"
          />
        </>
      )}
    </div>
  );
};

export default MeetingNote;
