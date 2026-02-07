import { useMemo } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type ServerDocumentType,
  createTextDocument,
  deleteDocument,
  downloadDocumentBlob,
  getDocumentDetail,
  getDocuments,
  patchTextDocument,
  uploadDocumentFile,
} from '../apis/document';
import type { DocumentItem } from '../types/document';
import { formatDotDate, toDisplayExt } from '../types/document';

const qk = {
  list: (projectId: number) => ['documents', projectId] as const,
  detail: (documentId: number) => ['document', documentId] as const,
};

const toItem = (x: any): DocumentItem => ({
  id: x.documentId,
  name: x.title,
  type: x.type as ServerDocumentType,
  ext: toDisplayExt(x.type as ServerDocumentType),
  uploader: x.uploaderName,
  uploadedAt: formatDotDate(x.uploadDate),
  canEdit: Boolean(x.canEdit),
  downloadUrl: x.downloadUrl ?? undefined,
});

export const useDocuments = (projectId: number | undefined) => {
  const enabled = typeof projectId === 'number' && Number.isFinite(projectId);
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: enabled ? qk.list(projectId!) : ['documents', 'disabled'],
    queryFn: async () => {
      const res = await getDocuments(projectId!);
      return res.map(toItem);
    },
    enabled,
  });

  const documents = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  const uploadMutation = useMutation({
    mutationFn: async (args: { file: File; type: Exclude<ServerDocumentType, 'TEXT'> }) => {
      if (!projectId) throw new Error('projectId missing');
      return uploadDocumentFile(projectId, args.file, args.type);
    },
    onSuccess: () => {
      if (projectId) qc.invalidateQueries({ queryKey: qk.list(projectId) });
    },
  });

  const createTextMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      if (!projectId) throw new Error('projectId missing');
      return createTextDocument(projectId, payload);
    },
    onSuccess: () => {
      if (projectId) qc.invalidateQueries({ queryKey: qk.list(projectId) });
    },
  });

  const patchTextMutation = useMutation({
    mutationFn: async (args: { documentId: number; title: string; content: string }) =>
      patchTextDocument(args.documentId, { title: args.title, content: args.content }),
    onSuccess: (_data, vars) => {
      qc.setQueryData(qk.detail(vars.documentId), (prev: any) =>
        prev ? { ...prev, title: vars.title, content: vars.content } : prev,
      );
      if (projectId) qc.invalidateQueries({ queryKey: qk.list(projectId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => deleteDocument(documentId),
    onSuccess: () => {
      if (projectId) qc.invalidateQueries({ queryKey: qk.list(projectId) });
    },
  });

  const getDetail = async (documentId: number) => {
    const cached = qc.getQueryData(qk.detail(documentId)) as any | undefined;
    if (cached) return cached;
    const detail = await qc.fetchQuery({
      queryKey: qk.detail(documentId),
      queryFn: () => getDocumentDetail(documentId),
    });
    return detail;
  };

  const addFiles = async (files: File[], uiType: 'pdf' | 'docx' | 'image') => {
    const typeMap: Record<typeof uiType, Exclude<ServerDocumentType, 'TEXT'>> = {
      pdf: 'PDF',
      docx: 'DOCX',
      image: 'IMAGE',
    };
    const serverType = typeMap[uiType];

    // 여러 개 업로드 지원
    for (const file of files) {
      await uploadMutation.mutateAsync({ file, type: serverType });
    }
  };

  const addTextDocumentUI = async (title: string, content: string) => {
    await createTextMutation.mutateAsync({ title, content });
  };

  const updateTextDocumentUI = async (documentId: number, title: string, content: string) => {
    await patchTextMutation.mutateAsync({ documentId, title, content });
  };

  const deleteDocumentUI = async (documentId: number) => {
    await deleteMutation.mutateAsync(documentId);
  };

  const download = async (doc: DocumentItem) => {
    const blob = await downloadDocumentBlob(doc.id);
    const url = URL.createObjectURL(blob);

    try {
      const a = document.createElement('a');
      a.href = url;

      const ext =
        doc.type === 'TEXT'
          ? 'txt'
          : doc.type === 'PDF'
            ? 'pdf'
            : doc.type === 'DOCX'
              ? 'docx'
              : 'file';

      a.download = `${doc.name}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return {
    documents,
    isEmpty: documents.length === 0,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,

    addFiles,
    addTextDocument: addTextDocumentUI,
    updateTextDocument: updateTextDocumentUI,
    deleteDocument: deleteDocumentUI,
    download,

    getDetail,
  };
};
