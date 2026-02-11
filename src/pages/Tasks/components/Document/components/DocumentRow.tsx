import { useState } from 'react';

import downloadIcon from '@assets/icon-download.svg';

import { type DocumentItem } from '../types/document';
import DocumentPreviewModal from './DocumentPreviewModal';

type Props = {
  doc: DocumentItem;
  onDelete: (id: number) => void;
  onDownload: (doc: DocumentItem) => void;
  onEditText: (id: number) => void;
};

const DocumentRow = ({ doc, onDelete, onDownload, onEditText }: Props) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isText = doc.type === 'TEXT' || doc.ext === '텍스트';
  const disabledEdit = !doc.canEdit;

  return (
    <>
      <div className="flex h-14 items-center self-stretch border-r border-b border-l border-gray-200 bg-white p-3.5">
        <div className="inline-flex w-full items-center justify-between">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="w-44 overflow-hidden text-left font-['Roboto'] text-xs font-medium text-ellipsis whitespace-nowrap text-neutral-600 hover:underline"
            title={doc.name}
          >
            {doc.name}
          </button>

          <div className="flex items-center justify-start gap-7">
            <div className="flex items-center justify-start gap-14">
              <div className="w-12 font-['Roboto'] text-xs font-medium text-neutral-600">
                {doc.ext}
              </div>
              <div className="w-12 font-['Roboto'] text-xs font-medium text-neutral-600">
                {doc.uploader}
              </div>
              <div className="w-16 font-['Roboto'] text-xs font-medium text-neutral-600">
                {doc.uploadedAt}
              </div>
            </div>

            <div className="flex items-center justify-start gap-6">
              {isText ? (
                <button
                  type="button"
                  onClick={() => onEditText(doc.id)}
                  disabled={disabledEdit}
                  className="text-center font-['Roboto'] text-xs font-medium text-neutral-400 disabled:opacity-40"
                >
                  수정
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onDownload(doc)}
                  className="flex h-6 w-6 items-center justify-center"
                  aria-label="다운로드"
                  title="다운로드"
                >
                  <img src={downloadIcon} alt="다운로드" className="h-6 w-6" draggable={false} />
                </button>
              )}

              <button
                type="button"
                onClick={() => onDelete(doc.id)}
                className="text-center font-['Roboto'] text-xs font-medium text-neutral-400 disabled:opacity-40"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        documentId={doc.id}
        title={doc.name}
      />
    </>
  );
};

export default DocumentRow;
