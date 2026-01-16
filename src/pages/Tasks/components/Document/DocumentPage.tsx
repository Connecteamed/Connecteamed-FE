import { useMemo, useRef, useState } from 'react';
import { useDocuments } from './hooks/useDocuments';
import { type ViewMode } from './types/document';

import DocumentList from './components/DocumentList';
import EmptyDocument from './components/EmptyDocument';
import TextEditor from './components/TextEditor';
import DeleteModal from '@/components/DeleteModal';

const DocumentPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    documents,
    isEmpty,
    addFiles,
    addTextDocument,
    updateTextDocument,
    deleteDocument,
    downloadLocal,
  } = useDocuments();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [view, setView] = useState<ViewMode>('LIST');

  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const editingDoc = useMemo(() => {
    if (!editingTextId) return null;
    return documents.find((d) => d.id === editingTextId) ?? null;
  }, [documents, editingTextId]);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) addFiles(files);
    e.target.value = '';
  };

  const openTextCreate = () => {
    setEditingTextId(null);
    setView('TEXT_EDITOR');
  };

  const openTextEdit = (id: string) => {
    setEditingTextId(id);
    setView('TEXT_EDITOR');
  };

  const onRequestDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    deleteDocument(deleteTargetId);
    closeDeleteModal();
  };

  const handleSaveText = ({ title, content }: { title: string; content: string }) => {
    if (editingTextId) {
      updateTextDocument(editingTextId, title, content);
    } else {
      addTextDocument(title, content);
    }
    setView('LIST');
  };

  return (
    <>
      <input ref={fileInputRef} type="file" hidden multiple onChange={onPickFiles} />

      {view === 'TEXT_EDITOR' ? (
        <TextEditor
          onBack={() => setView('LIST')}
          initialTitle={editingDoc?.name ?? ''}
          initialContent={editingDoc?.content ?? ''}
          submitLabel={editingTextId ? '수정하기' : '저장하기'}
          onSave={handleSaveText}
        />
      ) : isEmpty ? (
        <EmptyDocument onAdd={() => fileInputRef.current?.click()} />
      ) : (
        <DocumentList
          documents={documents}
          onDelete={onRequestDelete}
          onDownload={downloadLocal}
          onPickFile={() => fileInputRef.current?.click()}
          onClickText={openTextCreate}
          onEditText={openTextEdit}
        />
      )}

      <DeleteModal
        isOpen={isDeleteOpen}
        title="문서 삭제"
        description="해당 문서를 삭제할까요?"
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default DocumentPage;
