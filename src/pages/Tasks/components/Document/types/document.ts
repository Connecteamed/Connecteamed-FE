import type { ServerDocumentType } from '../apis/document';

export type ViewMode = 'LIST' | 'TEXT_EDITOR';

export type DisplayExt = '텍스트' | 'PDF' | 'DOCX' | 'IMAGE';

export type DocumentItem = {
  id: number;
  name: string;
  ext: DisplayExt;
  uploader: string;
  uploadedAt: string;
  canEdit: boolean;
  type: ServerDocumentType;

  content?: string;

  downloadUrl?: string;
};

export const toDisplayExt = (type: ServerDocumentType): DisplayExt => {
  switch (type) {
    case 'TEXT':
      return '텍스트';
    case 'PDF':
      return 'PDF';
    case 'DOCX':
      return 'DOCX';
    case 'IMAGE':
      return 'IMAGE';
    default:
      return 'PDF';
  }
};

export const formatDotDate = (isoLike: string) => {
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return isoLike;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};
