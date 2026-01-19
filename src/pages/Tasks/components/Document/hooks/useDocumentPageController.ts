import { useMemo, useRef, useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { type ViewMode } from '../types/document';

export const useDocumentPageController = () => {
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

  const triggerFilePicker = () => fileInputRef.current?.click();

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

  const goList = () => setView('LIST');

  return {
    // refs
    fileInputRef,

    // data
    documents,
    isEmpty,
    view,
    editingTextId,
    editingDoc,

    // delete modal
    isDeleteOpen,

    // actions
    onPickFiles,
    triggerFilePicker,

    openTextCreate,
    openTextEdit,
    onRequestDelete,
    confirmDelete,
    closeDeleteModal,

    downloadLocal,
    handleSaveText,
    goList,
  };
};
