import { useCallback, useMemo, useState } from 'react';

import iconArrowLeftBlack from '@assets/icon-arrow-left-black.svg';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import EditorToolbar from '../components/EditorToolbar';
import { useSidebarWidth } from '../hooks/useSidebarWidth';

type TextEditorProps = {
  onBack: () => void;

  initialTitle?: string;
  initialContent?: string;
  submitLabel?: string;
  onSave: (payload: { title: string; content: string }) => void;

  sidebarSelector?: string;
  fallbackSidebarWidth?: number;
};

function ensureHtmlContent(content: string) {
  const c = content?.trim() ?? '';
  if (!c) return '<p></p>';

  if (c.startsWith('<') && c.includes('>')) return c;

  const escaped = c
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />');
  return `<p>${escaped}</p>`;
}

function stripHtmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const TextEditorInner: React.FC<TextEditorProps> = ({
  onBack,
  initialTitle = '',
  initialContent = '',
  submitLabel = '저장하기',
  onSave,
  sidebarSelector = 'aside',
  fallbackSidebarWidth = 260,
}) => {
  const sidebarWidth = useSidebarWidth({ sidebarSelector, fallbackSidebarWidth });

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(() => ensureHtmlContent(initialContent));

  const trimmedTitle = useMemo(() => title.trim(), [title]);
  const contentText = useMemo(() => stripHtmlToText(content), [content]);

  const canSubmit = useMemo(
    () => trimmedTitle.length > 0 && contentText.length > 0,
    [trimmedTitle, contentText],
  );

  const submit = useCallback(() => {
    if (!canSubmit) return;
    onSave({ title: trimmedTitle, content });
  }, [canSubmit, onSave, trimmedTitle, content]);

  const editor = useEditor({
    editable: true,
    autofocus: 'end',
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: ensureHtmlContent(initialContent),
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "w-full h-full outline-none text-base font-medium font-['Roboto'] leading-4 text-gray-900",
      },
    },
  });

  return (
    <div
      className="fixed inset-y-0 right-0 z-[999] overflow-x-hidden overflow-y-auto bg-white"
      style={{ left: `${sidebarWidth}px` }}
    >
      <div className="flex w-full justify-center">
        <div className="flex w-[1140px] flex-col items-start justify-start gap-2.5 px-[45px] py-[74px]">
          <div className="flex flex-col items-start justify-start gap-8 self-stretch">
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center"
              aria-label="뒤로가기"
              title="뒤로가기"
            >
              <img
                src={iconArrowLeftBlack}
                alt="뒤로가기"
                className="h-6 w-6 brightness-0"
                draggable={false}
              />
            </button>

            <div className="flex flex-col items-center justify-start gap-12 self-stretch">
              <div className="flex flex-col items-start justify-start gap-8 self-stretch">
                <div className="inline-flex h-12 items-center justify-start gap-2.5 self-stretch rounded-[10px] bg-white px-3.5 py-2.5 outline outline-1 outline-offset-[-1px] outline-gray-300">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent font-['Roboto'] text-base leading-4 font-medium outline-none placeholder:text-gray-400"
                    placeholder="제목을 입력하세요"
                  />
                </div>

                <EditorToolbar editor={editor} />

                <div className="inline-flex h-[420px] min-h-[420px] items-start justify-start gap-2.5 self-stretch rounded-[10px] bg-white p-3.5 outline outline-1 outline-offset-[-1px] outline-gray-300">
                  <div
                    className="h-full w-full overflow-y-auto"
                    onMouseDown={() => {
                      if (!editor) return;
                      editor.chain().focus().run();
                    }}
                  >
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={submit}
                className={`inline-flex h-14 w-96 items-center justify-center gap-2.5 rounded-[5px] px-10 py-3 outline outline-1 outline-offset-[-1px] ${
                  canSubmit
                    ? 'bg-orange-500 outline-orange-500 hover:brightness-95 active:brightness-90'
                    : 'cursor-not-allowed bg-gray-300 outline-gray-200'
                }`}
              >
                <span className="text-center font-['Roboto'] text-lg font-medium text-white">
                  {submitLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .ProseMirror { min-height: 100%; }
          .ProseMirror a { text-decoration: underline; }
          .ProseMirror:focus { outline: none; }
          .ProseMirror ul { padding-left: 1.25rem; list-style: disc; }
          .ProseMirror ol { padding-left: 1.25rem; list-style: decimal; }
        `}
      </style>
    </div>
  );
};

const TextEditor: React.FC<TextEditorProps> = (props) => {
  const key = `${props.initialTitle ?? ''}__${props.initialContent ?? ''}`;
  return <TextEditorInner key={key} {...props} />;
};

export default TextEditor;
