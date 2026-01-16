import { useState } from 'react';
import { type DocumentItem } from '../types/document';

const formatDate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const getExt = (fileName: string) => {
  const idx = fileName.lastIndexOf('.');
  return idx >= 0 ? fileName.slice(idx + 1).toUpperCase() : 'FILE';
};

const getNameWithoutExt = (fileName: string) => {
  const idx = fileName.lastIndexOf('.');
  return idx >= 0 ? fileName.slice(0, idx) : fileName;
};

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const addFiles = (files: File[]) => {
    const now = new Date();

    const newDocs: DocumentItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      name: getNameWithoutExt(file.name),
      ext: getExt(file.name),
      uploader: '팀원1',
      uploadedAt: formatDate(now),
      file,
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const addTextDocument = (title: string, content: string) => {
    const now = new Date();

    const newDoc: DocumentItem = {
      id: crypto.randomUUID(),
      name: title,
      ext: '텍스트',
      uploader: '팀원1',
      uploadedAt: formatDate(now),
      content,
      file: undefined,
    };

    setDocuments((prev) => [...prev, newDoc]);
  };

  const updateTextDocument = (id: string, title: string, content: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, name: title, content } : d)));
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const downloadLocal = (doc: DocumentItem) => {
    if (!doc.file) return;

    const url = URL.createObjectURL(doc.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return {
    documents,
    isEmpty: documents.length === 0,
    addFiles,
    addTextDocument,
    updateTextDocument,
    deleteDocument,
    downloadLocal,
  };
};
