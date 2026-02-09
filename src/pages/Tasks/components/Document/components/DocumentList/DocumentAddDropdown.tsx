import React from 'react';
import useOutsideClose from '../../hooks/useOutsideClose';

type Props = {
  onPickFile: (type: 'pdf' | 'docx' | 'image') => void;
  onClickText: () => void;
};

const DocumentAddDropdown = ({ onPickFile, onClickText }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = () => setIsOpen((prev) => !prev);

  useOutsideClose({ enabled: isOpen, onClose: close, ref: wrapRef });

  return (
    <div className="self-stretch flex justify-end">
      <div ref={wrapRef} className="relative">
        <button
          type="button"
          onClick={toggle}
          className={`w-24 h-8 px-2 py-[5px] rounded-[10px] inline-flex justify-center items-center gap-2.5 ${
            isOpen ? 'bg-gray-400' : 'bg-orange-500'
          }`}
        >
          <span className="text-center text-white text-xs font-medium font-['Roboto']">
            문서 추가
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-10 z-50">
            <div className="h-40 p-3 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] inline-flex justify-start items-center gap-2.5">
              <div className="w-20 inline-flex flex-col justify-start items-start gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onPickFile('pdf');
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
                    close();
                    onPickFile('docx');
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
                    close();
                    onPickFile('image');
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
                    close();
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
  );
};

export default DocumentAddDropdown;
