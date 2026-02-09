import { instance } from '@/apis/axios';

type ApiResponse<T> = {
  status: string;
  data: T;
  message: string;
  code: string | null;
};

export type ServerDocumentType = 'TEXT' | 'PDF' | 'DOCX' | 'IMAGE';

export type DocumentListItem = {
  documentId: number;
  title: string;
  type: ServerDocumentType;
  uploaderName: string;
  uploadDate: string;
  downloadUrl: string;
  canEdit: boolean;
};

export type DocumentListRes = { documents: DocumentListItem[] };

export type DocumentDetailRes = {
  documentId: number;
  title: string;
  type: ServerDocumentType;
  content: string; // TEXT일 때 의미 있음
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getDocuments(projectId: number) {
  const { data } = await instance.get<ApiResponse<DocumentListRes>>(
    `/projects/${projectId}/documents`,
  );
  return data.data.documents;
}

export async function uploadDocumentFile(
  projectId: number,
  file: File,
  type: Exclude<ServerDocumentType, 'TEXT'>,
) {
  const form = new FormData();
  form.append('file', file);
  form.append('type', type); // 대문자로 -> 'PDF' | 'DOCX' | 'IMAGE'

  const { data } = await instance.post<
    ApiResponse<{ documentId: number; fileName: string; createdAt: string }>
  >(`/projects/${projectId}/documents/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
}

export async function createTextDocument(
  projectId: number,
  payload: { title: string; content: string },
) {
  const { data } = await instance.post<ApiResponse<{ documentId: number; createdAt: string }>>(
    `/projects/${projectId}/documents/text`,
    payload,
  );
  return data.data;
}

export async function getDocumentDetail(documentId: number) {
  const { data } = await instance.get<ApiResponse<DocumentDetailRes>>(`/documents/${documentId}`);
  return data.data;
}

export async function patchTextDocument(
  documentId: number,
  payload: { title: string; content: string },
) {
  const { data } = await instance.patch<ApiResponse<null>>(`/documents/${documentId}`, payload);
  return data;
}

export async function deleteDocument(documentId: number) {
  const { data } = await instance.delete<ApiResponse<null>>(`/documents/${documentId}`);
  return data;
}

export async function downloadDocumentBlob(documentId: number) {
  const res = await instance.get(`/documents/${documentId}/download`, { responseType: 'blob' });
  return res.data as Blob;
}
