import { useEffect, useMemo, useRef, useState } from 'react';

import closeIcon from '@assets/icon-close.svg';
import mammoth from 'mammoth';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Modal from '@/components/Modal';

import { type DocumentDetailRes, downloadDocumentBlob, getDocumentDetail } from '../apis/document';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type Props = {
  isOpen: boolean;
  onClose: () => void;

  documentId: number | null;
  title?: string;
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

const DocumentPreviewModal = ({ isOpen, onClose, documentId, title }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<DocumentDetailRes | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [docxHtml, setDocxHtml] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const blobUrlRef = useRef<string | null>(null);
  const pdfUrlRef = useRef<string | null>(null);

  const revokeObjectUrls = () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    blobUrlRef.current = null;
    pdfUrlRef.current = null;
  };

  const headerTitle = useMemo(
    () => title ?? detail?.title ?? '문서 미리보기',
    [title, detail?.title],
  );

  const pdfFile = useMemo(() => (pdfUrl ? pdfUrl : null), [pdfUrl]);

  useEffect(() => {
    if (!isOpen) return;

    return () => {
      revokeObjectUrls();
      setBlobUrl(null);
      setPdfUrl(null);

      setDocxHtml('');
      setError(null);
      setLoading(false);
      setDetail(null);
    };
  }, [isOpen]);

  useEffect(() => {
    const run = async () => {
      if (!isOpen) return;
      if (!documentId) return;

      setLoading(true);
      setError(null);
      setDocxHtml('');
      setDetail(null);

      revokeObjectUrls();
      setBlobUrl(null);
      setPdfUrl(null);

      try {
        const d = await getDocumentDetail(documentId);
        setDetail(d);

        if (d.type === 'TEXT') {
          setLoading(false);
          return;
        }

        const blob = await downloadDocumentBlob(documentId);

        // DOCX
        if (d.type === 'DOCX') {
          const arrayBuffer = await blob.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setDocxHtml(result.value);
          setLoading(false);
          return;
        }

        // PDF
        if (d.type === 'PDF') {
          const buf = await blob.arrayBuffer();

          const header = new TextDecoder().decode(buf.slice(0, 4));
          if (header !== '%PDF') {
            const headText = new TextDecoder().decode(buf.slice(0, 180)).trim();
            setError(`PDF 데이터가 아니에요. 응답 앞부분: ${headText}`);
            setLoading(false);
            return;
          }

          const url = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
          setPdfUrl(url);
          pdfUrlRef.current = url;
          setLoading(false);
          return;
        }

        // IMAGE
        if (d.type === 'IMAGE') {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          blobUrlRef.current = url;
          setLoading(false);
          return;
        }

        setLoading(false);
        setError('지원하지 않는 파일 형식입니다.');
      } catch {
        setLoading(false);
        setError('문서를 불러오지 못했어요. (서버/권한/다운로드 응답 확인 필요)');
      }
    };

    run();
  }, [isOpen, documentId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative inline-flex h-[750px] w-[650px] items-center justify-start gap-2.5 rounded-[20px] bg-white px-14 py-14">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          title="닫기"
          className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center"
        >
          <img src={closeIcon} alt="닫기" />
        </button>

        <div className="flex h-[632px] w-[530px] flex-col overflow-hidden rounded-[10px] bg-slate-100">
          <div className="min-h-0 flex-1 overflow-auto p-4">
            {!documentId && (
              <div className="flex h-full items-center justify-center text-neutral-500">
                문서를 선택해주세요.
              </div>
            )}

            {documentId && loading && (
              <div className="flex h-full items-center justify-center text-neutral-600">
                불러오는 중…
              </div>
            )}

            {documentId && error && (
              <div className="flex h-full items-center justify-center text-sm text-red-500">
                {error}
              </div>
            )}

            {documentId && !loading && !error && detail && (
              <>
                {detail.type === 'TEXT' && (
                  <div className="rounded-md bg-white p-4 text-sm whitespace-pre-wrap text-neutral-800">
                    {detail.content?.trim() ? detail.content : '내용이 없습니다.'}
                  </div>
                )}

                {detail.type === 'DOCX' && (
                  <div className="rounded-md bg-white p-4">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: docxHtml || '<p>내용이 없습니다.</p>',
                      }}
                    />
                  </div>
                )}

                {detail.type === 'IMAGE' && blobUrl && (
                  <div className="flex w-full justify-center">
                    <img
                      src={blobUrl}
                      alt={headerTitle}
                      className="max-h-[520px] max-w-full rounded-md object-contain"
                    />
                  </div>
                )}

                {detail.type === 'PDF' && pdfFile && (
                  <div className="w-full rounded-md p-2">
                    <Document
                      key={pdfFile}
                      file={pdfFile}
                      onLoadError={(err) => {
                        console.error('[PDF onLoadError]', err);
                        setError(`PDF 렌더링 실패: ${getErrorMessage(err)}`);
                      }}
                      onSourceError={(err) => {
                        console.error('[PDF onSourceError]', err);
                        setError(`PDF 소스 오류: ${getErrorMessage(err)}`);
                      }}
                      loading={<div className="p-4 text-sm text-neutral-600">PDF 로딩중…</div>}
                    >
                      <Page pageNumber={1} width={480} />
                    </Document>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentPreviewModal;
