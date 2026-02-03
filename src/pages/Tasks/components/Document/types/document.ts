export type DocumentItem = {
  id: string;
  name: string;
  ext: string;
  uploader: string;
  uploadedAt: string;

  file?: File;
  content?: string;
};

export type ViewMode = 'LIST' | 'TEXT_EDITOR';
