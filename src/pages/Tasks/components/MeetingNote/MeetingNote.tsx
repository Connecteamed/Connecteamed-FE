import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import DeleteModal from '@/components/DeleteModal';

import EmptyMeeting from './EmptyMeeting';
import MeetingList from './MeetingList';
import type { Meeting } from './type';

const MeetingNote = () => {
  const navigate = useNavigate();

  // 테스트용 데이터
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: 1, title: '1차 회의', members: '팀원1', date: '2025.11.24' },
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [meetingIdToDelete, setMeetingIdToDelete] = useState<string | number | null>(null);

  const handleCreateClick = () => {
    navigate('/minutes');
  };

  const handleDelete = (id: string | number) => {
    setMeetingIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (meetingIdToDelete === null) return;
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== meetingIdToDelete));
    setIsDeleteModalOpen(false);
    setMeetingIdToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMeetingIdToDelete(null);
  };

  return (
    <div className="w-full">
      {meetings.length === 0 ? (
        <EmptyMeeting onCreate={handleCreateClick} />
      ) : (
        <>
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
