import React, { useEffect, useRef, useState } from 'react';
import { type DocumentItem } from '../types/document';
import DocumentRow from './DocumentRow';

type Props = {
  documents: DocumentItem[];
  onDelete: (id: string) => void;
  onDownload: (doc: DocumentItem) => void;
  onPickFile: () => void;
  onClickText: () => void;

  onEditText: (id: string) => void;
};

const DocumentList: React.FC<Props> = ({
  documents,
  onDelete,
  onDownload,
  onPickFile,
  onClickText,
  onEditText,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const addBtnWrapRef = useRef<HTMLDivElement | null>(null);

  const closeAddModal = () => setIsAddModalOpen(false);
  const toggleAddModal = () => setIsAddModalOpen((prev) => !prev);

  useEffect(() => {
    if (!isAddModalOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (addBtnWrapRef.current && !addBtnWrapRef.current.contains(target)) closeAddModal();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAddModal();
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isAddModalOpen]);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-7">
      <div className="self-stretch flex flex-col justify-start items-start">
        <div className="self-stretch h-12 p-3.5 bg-slate-100 border-l border-r border-t border-gray-200 flex items-center">
          <div className="w-full inline-flex justify-between items-center">
            <div className="w-20 text-black text-sm font-medium font-['Inter']">문서명</div>
            <div className="flex justify-start items-center gap-14">
              <div className="text-black text-sm font-medium font-['Inter']">파일형식</div>
              <div className="text-black text-sm font-medium font-['Inter']">올린 사람</div>
              <div className="text-black text-sm font-medium font-['Inter']">올린 날짜</div>
              <div className="w-16 h-5" />
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

      <div className="self-stretch flex justify-end">
        <div ref={addBtnWrapRef} className="relative">
          <button
            type="button"
            onClick={toggleAddModal}
            className={`w-24 h-8 px-2 py-[5px] rounded-[10px] inline-flex justify-center items-center gap-2.5 ${
              isAddModalOpen ? 'bg-gray-400' : 'bg-orange-500'
            }`}
          >
            <span className="text-center text-white text-xs font-medium font-['Roboto']">
              문서 추가
            </span>
          </button>

          {isAddModalOpen && (
            <div className="absolute right-0 top-10 z-50">
              <div className="h-40 p-3 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] inline-flex justify-start items-center gap-2.5">
                <div className="w-20 inline-flex flex-col justify-start items-start gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      closeAddModal();
                      onPickFile();
                    }}
                    className="self-stretch h-7 px-3.5 py-1.5 bg-zinc-200 rounded-[5px] inline-flex justify-center items-center gap-2.5"
                  >
                    <span className="text-center text-neutral-600 text-xs font-medium font-['Roboto']">
                      PDF
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeAddModal();
                      onPickFile();
                    }}
                    className="self-stretch h-7 px-3.5 py-1.5 bg-zinc-200 rounded-[5px] inline-flex justify-center items-center gap-2.5"
                  >
                    <span className="text-center text-neutral-600 text-xs font-medium font-['Roboto']">
                      docx
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeAddModal();
                      onPickFile();
                    }}
                    className="self-stretch h-7 px-3.5 py-1.5 bg-zinc-200 rounded-[5px] inline-flex justify-center items-center gap-2.5"
                  >
                    <span className="text-center text-neutral-600 text-xs font-medium font-['Roboto']">
                      이미지
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeAddModal();
                      onClickText();
                    }}
                    className="self-stretch h-7 px-3.5 py-1.5 bg-zinc-200 rounded-[5px] inline-flex justify-center items-center gap-2.5"
                  >
                    <span className="text-center text-neutral-600 text-xs font-medium font-['Roboto']">
                      텍스트
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
