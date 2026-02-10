import { useMemo, useRef, useState } from 'react';

import type { ViewMode } from '../types/document';
import type { DocumentItem } from '../types/document';
import { useDocuments } from './useDocuments';

export type PickFileType = 'pdf' | 'docx' | 'image';

export const useDocumentPageController = (projectId: number | undefined) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    documents,
    isEmpty,
    addFiles,
    addTextDocument,
    updateTextDocument,
    deleteDocument,
    download,
    getDetail,
  } = useDocuments(projectId);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [view, setView] = useState<ViewMode>('LIST');
  const [editingTextId, setEditingTextId] = useState<number | null>(null);

  const [editingDetail, setEditingDetail] = useState<{ title: string; content: string } | null>(
    null,
  );

  const editingDoc = useMemo<DocumentItem | null>(() => {
    if (!editingTextId) return null;
    return documents.find((d) => d.id === editingTextId) ?? null;
  }, [documents, editingTextId]);

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>, forcedType?: PickFileType) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;

    const infer = (file: File): PickFileType => {
      const name = file.name.toLowerCase();
      if (name.endsWith('.pdf')) return 'pdf';
      if (name.endsWith('.doc') || name.endsWith('.docx')) return 'docx';
      return 'image';
    };

    if (forcedType) {
      await addFiles(files, forcedType);
      return;
    }

    const groups: Record<PickFileType, File[]> = { pdf: [], docx: [], image: [] };
    files.forEach((f) => groups[infer(f)].push(f));

    for (const t of Object.keys(groups) as PickFileType[]) {
      if (groups[t].length) await addFiles(groups[t], t);
    }
  };

  const acceptMap: Record<PickFileType, string> = {
    pdf: 'application/pdf,.pdf',
    docx: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    image: 'image/*',
  };

  const triggerPickAnyFile = () => {
    const input = fileInputRef.current;
    if (!input) return;
    input.accept = '';
    input.click();
  };

  const triggerPickFileByType = (type: PickFileType) => {
    const input = fileInputRef.current;
    if (!input) return;
    input.accept = acceptMap[type];
    input.click();
  };

  const openTextCreate = () => {
    setEditingTextId(null);
    setEditingDetail({ title: '', content: '' });
    setView('TEXT_EDITOR');
  };

  const openTextEdit = async (id: number) => {
    setEditingTextId(id);

    const detail = await getDetail(id);
    setEditingDetail({ title: detail.title ?? '', content: detail.content ?? '' });

    setView('TEXT_EDITOR');
  };

  const onRequestDelete = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteDocument(deleteTargetId);
    closeDeleteModal();
  };

  const handleSaveText = async ({ title, content }: { title: string; content: string }) => {
    if (editingTextId) {
      await updateTextDocument(editingTextId, title, content);
    } else {
      await addTextDocument(title, content);
    }
    setView('LIST');
  };

  const goList = () => setView('LIST');

  return {
    fileInputRef,

    documents,
    isEmpty,
    view,

    editingTextId,
    editingDocTitle: editingDetail?.title ?? editingDoc?.name ?? '',
    editingDocContent: editingDetail?.content ?? editingDoc?.content ?? '',

    isDeleteOpen,

    onPickFiles,
    triggerPickAnyFile,
    triggerPickFileByType,

    openTextCreate,
    openTextEdit,

    onRequestDelete,
    confirmDelete,
    closeDeleteModal,

    download,
    handleSaveText,
    goList,
  };
};
