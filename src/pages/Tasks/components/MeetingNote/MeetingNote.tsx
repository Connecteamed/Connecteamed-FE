import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import DeleteModal from '@/components/DeleteModal';

import EmptyMeeting from './EmptyMeeting';
import MeetingList from './MeetingList';
import type { Meeting } from './type';

interface MeetingNoteProps {
  newMeeting?: Meeting;
}

const MeetingNote = ({ newMeeting }: MeetingNoteProps) => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: 1, title: '1차 회의', members: '팀원1', date: '2025.11.24' },
  ]);

  const [deletedIds, setDeletedIds] = useState<Set<Meeting['id']>>(() => new Set());

  const filteredMeetings = useMemo(() => {
    const baseFiltered = meetings.filter((m) => !deletedIds.has(m.id));

    if (!newMeeting) return baseFiltered;
    if (deletedIds.has(newMeeting.id)) return baseFiltered;

    const exists = baseFiltered.some((m) => m.id === newMeeting.id);
    return exists ? baseFiltered : [newMeeting, ...baseFiltered];
  }, [meetings, newMeeting, deletedIds]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [meetingIdToDelete, setMeetingIdToDelete] = useState<Meeting['id'] | null>(null);

  const handleCreateClick = () => {
    navigate('/minutes');
  };

  const handleDelete = (id: Meeting['id']) => {
    setMeetingIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (meetingIdToDelete === null) return;

    setMeetings((prev) => prev.filter((m) => m.id !== meetingIdToDelete));

    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(meetingIdToDelete);
      return next;
    });

    setIsDeleteModalOpen(false);
    setMeetingIdToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMeetingIdToDelete(null);
  };

  return (
    <div className="w-full">
      {filteredMeetings.length === 0 ? (
        <EmptyMeeting onCreate={handleCreateClick} />
      ) : (
        <>
          <MeetingList
            meetings={filteredMeetings}
            onCreate={handleCreateClick}
            onDelete={handleDelete}
          />
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
