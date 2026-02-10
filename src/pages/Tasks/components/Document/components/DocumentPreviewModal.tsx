import { useEffect, useMemo, useState } from 'react';

import closeIcon from '@assets/icon-close.svg';
import mammoth from 'mammoth';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Document, Page, pdfjs } from 'react-pdf';
// (CSS 경로가 네 프로젝트에서 존재하는 형태로 유지)
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Modal from '@/components/Modal';

// ✅ 너가 올린 api 파일(document.ts)
import {
  type DocumentDetailRes,
  type ServerDocumentType,
  downloadDocumentBlob,
  getDocumentDetail,
} from '../apis/document';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

type Props = {
  isOpen: boolean;
  onClose: () => void;

  // ✅ 어떤 문서를 미리보기할지
  documentId: number | null;
  title?: string;
};

const DocumentPreviewModal = ({ isOpen, onClose, documentId, title }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detail, setDetail] = useState<DocumentDetailRes | null>(null);

  // IMAGE 미리보기용
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // DOCX 변환 HTML
  const [docxHtml, setDocxHtml] = useState<string>('');

  // ✅ PDF는 ArrayBuffer로 넘기지 않고 "blob URL"로 넘긴다 (detached 방지)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);

  const headerTitle = useMemo(
    () => title ?? detail?.title ?? '문서 미리보기',
    [title, detail?.title],
  );

  // react-pdf file prop는 string을 그대로 쓰면 됨 (memoize)
  const pdfFile = useMemo(() => (pdfUrl ? pdfUrl : null), [pdfUrl]);

  // 모달 열림/닫힘 시 URL 정리
  useEffect(() => {
    if (!isOpen) return;

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);

      setBlobUrl(null);
      setPdfUrl(null);

      setDocxHtml('');
      setError(null);
      setLoading(false);
      setDetail(null);
      setNumPages(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 미리보기 데이터 로드
  useEffect(() => {
    const run = async () => {
      if (!isOpen) return;
      if (!documentId) return;

      setLoading(true);
      setError(null);
      setDocxHtml('');
      setDetail(null);
      setNumPages(0);

      // 기존 URL 정리 (문서 바뀔 때)
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      try {
        // 1) 상세 먼저 받아서 타입/텍스트 content 확인
        const d = await getDocumentDetail(documentId);
        setDetail(d);

        // 2) TEXT면 content만 보여주면 끝
        if (d.type === 'TEXT') {
          setLoading(false);
          return;
        }

        // 3) 파일 타입이면 blob 받아오기
        const blob = await downloadDocumentBlob(documentId);

        // DOCX
        if (d.type === 'DOCX') {
          const arrayBuffer = await blob.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setDocxHtml(result.value);
          setLoading(false);
          return;
        }

        // PDF (✅ blob URL로 처리)
        if (d.type === 'PDF') {
          const buf = await blob.arrayBuffer();

          // "%PDF" 확인 (서버가 html/json 내려주는 경우 빠르게 감지)
          const header = new TextDecoder().decode(buf.slice(0, 4));
          if (header !== '%PDF') {
            const headText = new TextDecoder().decode(buf.slice(0, 180)).trim();
            setError(`PDF 데이터가 아니에요. 응답 앞부분: ${headText}`);
            setLoading(false);
            return;
          }

          const url = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
          setPdfUrl(url);
          setLoading(false);
          return;
        }

        // IMAGE
        if (d.type === 'IMAGE') {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
          return;
        }

        // 혹시 모르는 타입
        setLoading(false);
        setError('지원하지 않는 파일 형식입니다.');
      } catch (e) {
        setLoading(false);
        setError('문서를 불러오지 못했어요. (서버/권한/다운로드 응답 확인 필요)');
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, documentId]);

  const type: ServerDocumentType | null = detail?.type ?? null;

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
          {/* 본문 */}
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
                {/* TEXT */}
                {detail.type === 'TEXT' && (
                  <div className="rounded-md bg-white p-4 text-sm whitespace-pre-wrap text-neutral-800">
                    {detail.content?.trim() ? detail.content : '내용이 없습니다.'}
                  </div>
                )}

                {/* DOCX */}
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

                {/* IMAGE */}
                {detail.type === 'IMAGE' && blobUrl && (
                  <div className="flex w-full justify-center">
                    <img
                      src={blobUrl}
                      alt={headerTitle}
                      className="max-h-[520px] max-w-full rounded-md object-contain"
                    />
                  </div>
                )}

                {/* PDF */}
                {detail.type === 'PDF' && pdfFile && (
                  <div className="w-full rounded-md bg-white p-2">
                    <Document
                      key={pdfFile}
                      file={pdfFile}
                      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      onLoadError={(err) => {
                        console.error('[PDF onLoadError]', err);
                        setError(`PDF 렌더링 실패: ${String((err as any)?.message ?? err)}`);
                      }}
                      onSourceError={(err) => {
                        console.error('[PDF onSourceError]', err);
                        setError(`PDF 소스 오류: ${String((err as any)?.message ?? err)}`);
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
