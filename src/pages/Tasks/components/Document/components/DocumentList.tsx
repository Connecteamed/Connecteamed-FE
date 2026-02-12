import downloadIcon from '@assets/icon-download.svg';

import { type DocumentItem } from '../types/document';
import DocumentAddDropdown from './DocumentAddDropdown';
import DocumentRow from './DocumentRow';

type Props = {
  documents: DocumentItem[];
  onDelete: (id: number) => void;
  onDownload: (doc: DocumentItem) => void;
  onPickFile: (type: 'pdf' | 'docx' | 'image') => void;
  onClickText: () => void;
  onEditText: (id: number) => void;
};

const DocumentList = ({
  documents,
  onDelete,
  onDownload,
  onPickFile,
  onClickText,
  onEditText,
}: Props) => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-6">
      {/* 데스크톱 테이블 */}
      <div className="hidden w-full flex-col items-start justify-start self-stretch md:flex">
        <div className="bg-neutral-10 flex h-12 items-center self-stretch border-t border-r border-l border-gray-200 p-3.5">
          <div className="inline-flex w-full items-center justify-between">
            <div className="w-44 px-1 font-['Inter'] text-sm font-medium text-black">문서명</div>

            <div className="flex items-center justify-start gap-7">
              <div className="flex items-center justify-start gap-14">
                <div className="w-12 font-['Inter'] text-sm font-medium whitespace-nowrap text-black">
                  파일형식
                </div>

                <div className="w-12 font-['Inter'] text-sm font-medium whitespace-nowrap text-black">
                  올린 사람
                </div>

                <div className="w-16 font-['Inter'] text-sm font-medium whitespace-nowrap text-black">
                  올린 날짜
                </div>
              </div>

              <div className="flex items-center justify-start gap-6">
                <div className="h-6 w-6" />
                <div className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {documents.map((doc) => (
          <DocumentRow
            key={doc.id}
            doc={doc}
            onDelete={onDelete}
            onDownload={onDownload}
            onEditText={onEditText}
          />
        ))}
      </div>

      {/* 모바일 카드 리스트 */}
      <div className="mt-4 w-full space-y-3 md:hidden">
        {documents.map((doc) => {
          const isText = doc.type === 'TEXT' || doc.ext === '텍스트';
          const disabledEdit = !doc.canEdit;

          return (
            <div key={doc.id} className="border-neutral-40 rounded-xl border bg-white px-4 py-3">
              <div className="flex gap-3">
                <div className="min-w-0 flex-1 pt-1">
                  <div className="line-clamp-1 text-lg font-semibold text-neutral-900">
                    {doc.name}
                  </div>
                  <div className="text-neutral-90 mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="uppercase">{doc.ext}</span>
                    <span>{doc.uploader}</span>
                  </div>
                  <div className="text-neutral-90 mt-3 text-sm font-medium">{doc.uploadedAt}</div>
                </div>

                <div className="flex shrink-0 flex-col items-end justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {isText ? (
                      <button
                        type="button"
                        onClick={() => onEditText(doc.id)}
                        disabled={disabledEdit}
                        className="text-neutral-70 pt-2 text-xs font-medium disabled:opacity-40"
                      >
                        수정
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onDownload(doc)}
                        className="flex h-5 w-5 items-center justify-center"
                        aria-label="다운로드"
                        title="다운로드"
                      >
                        <img
                          src={downloadIcon}
                          alt="다운로드"
                          className="h-5 w-5"
                          draggable={false}
                        />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(doc.id)}
                    className="text-neutral-70 pb-1 text-xs font-medium"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DocumentAddDropdown
        onPickFile={onPickFile}
        onClickText={onClickText}
        triggerClassName="w-24 h-8 md:w-[90px] md:h-[32px] md:rounded-lg"
        labelClassName="text-xs"
        containerClassName="flex w-full justify-end md:pt-7"
      />
    </div>
  );
};

export default DocumentList;
