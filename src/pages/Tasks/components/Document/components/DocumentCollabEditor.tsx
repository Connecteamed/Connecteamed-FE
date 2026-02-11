import { useEffect, useMemo, useRef } from 'react';

import { CollabClient } from '@/lib/collab/collabClient';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';

type QuillSelection = { index: number; length: number } | null;

type Props = {
  value: string;
  onChange: (nextValue: string) => void;
  collabEnabled: boolean;
  docId?: number | null;
  token?: string;
  userName?: string;
  wsBase?: string;
  placeholder?: string;
};

if (!Quill.imports['modules/cursors']) {
  Quill.register('modules/cursors', QuillCursors);
}

const toInitialHtml = (value: string) => {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return '<p><br></p>';
  if (trimmed.startsWith('<') && trimmed.includes('>')) return value;

  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />');
  return `<p>${escaped}</p>`;
};

const DocumentCollabEditor = ({
  value,
  onChange,
  collabEnabled,
  docId,
  token,
  userName,
  wsBase,
  placeholder = '내용을 입력하세요',
}: Props) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const clientRef = useRef(new CollabClient());
  const isSyncingFromValueRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const host = editorRef.current;
    if (!host) return;
    const client = clientRef.current;

    const clearStaleToolbars = () => {
      const parent = host.parentElement;
      if (!parent) return;

      Array.from(parent.children).forEach((node) => {
        if (
          node !== host &&
          node instanceof HTMLElement &&
          node.classList.contains('ql-toolbar') &&
          node.classList.contains('ql-snow')
        ) {
          node.remove();
        }
      });
    };

    clearStaleToolbars();
    host.className = '';
    host.removeAttribute('data-placeholder');
    host.innerHTML = '';

    const q = new Quill(host, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike', 'link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: '' }, { align: 'center' }, { align: 'right' }],
        ],
        cursors: {
          hideDelayMs: 600000,
          hideSpeedMs: 0,
          transformOnTextChange: true,
        },
      },
    });

    q.root.style.minHeight = '420px';
    q.root.style.fontSize = '16px';
    q.root.style.fontWeight = '500';
    q.clipboard.dangerouslyPasteHTML(toInitialHtml(valueRef.current || ''), 'silent');
    q.enable(true);

    const handleTextChange = () => {
      if (isSyncingFromValueRef.current) return;
      const awareness = clientRef.current.getAwareness();
      const range = q.getSelection();
      if (awareness && range) {
        awareness.setLocalStateField('cursor', {
          index: range.index,
          length: range.length,
        });
      }
      onChangeRef.current(q.root.innerHTML);
    };

    q.on('text-change', handleTextChange);
    quillRef.current = q;

    return () => {
      q.off('text-change', handleTextChange);
      client.disconnect({ quill: q, skipSnapshot: false, keepEditorEnabled: true });
      q.disable();
      quillRef.current = null;
      host.innerHTML = '';
      clearStaleToolbars();
    };
  }, [placeholder]);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    const next = value || '';
    const current = q.root.innerHTML;
    if (current === next) return;

    isSyncingFromValueRef.current = true;
    const selection = q.getSelection();
    q.clipboard.dangerouslyPasteHTML(toInitialHtml(next), 'silent');
    if (selection) q.setSelection(selection.index, selection.length, 'silent');
    isSyncingFromValueRef.current = false;
  }, [value]);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    const handleSelectionChange = (range: QuillSelection) => {
      const awareness = clientRef.current.getAwareness();
      if (!awareness) return;

      if (!range) {
        awareness.setLocalStateField('cursor', null);
        return;
      }

      awareness.setLocalStateField('cursor', {
        index: range.index,
        length: range.length,
      });
    };

    q.on('selection-change', handleSelectionChange);
    return () => {
      q.off('selection-change', handleSelectionChange);
    };
  }, []);

  const canCollab = useMemo(() => {
    if (!collabEnabled) return false;
    if (!token || !userName) return false;
    if (!docId || docId <= 0) return false;
    return true;
  }, [collabEnabled, docId, token, userName]);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    const client = clientRef.current;

    if (!canCollab) {
      client.disconnect({ quill: q, skipSnapshot: false, keepEditorEnabled: true });
      q.enable(true);
      return;
    }

    client.connect({
      docId: docId as number,
      textKey: 'content',
      token: token as string,
      userName: userName as string,
      quill: q,
      wsBase,
    });

    return () => {
      client.disconnect({ quill: q, skipSnapshot: false, keepEditorEnabled: true });
      q.enable(true);
    };
  }, [canCollab, docId, token, userName, wsBase]);

  return (
    <div className="doc-collab-editor w-full flex-1 [&_.ql-container.ql-snow]:min-h-[240px] [&_.ql-container.ql-snow]:w-full [&_.ql-container.ql-snow]:rounded-[10px] [&_.ql-container.ql-snow]:border [&_.ql-container.ql-snow]:border-gray-300 [&_.ql-container.ql-snow]:bg-white [&_.ql-container.ql-snow]:shadow-none sm:[&_.ql-container.ql-snow]:min-h-[300px] lg:[&_.ql-container.ql-snow]:min-h-[340px] [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:bg-white [&_.ql-editor]:px-[14px] [&_.ql-editor]:py-[10px] sm:[&_.ql-editor]:min-h-[260px] lg:[&_.ql-editor]:min-h-[300px] [&_.ql-editor.ql-blank::before]:right-[14px] [&_.ql-editor.ql-blank::before]:left-[14px] [&_.ql-editor.ql-blank::before]:text-gray-400 [&_.ql-editor.ql-blank::before]:not-italic [&_.ql-toolbar_.ql-formats]:mr-[6px] [&_.ql-toolbar_.ql-formats:last-child]:mr-0 [&_.ql-toolbar.ql-snow]:mb-8 [&_.ql-toolbar.ql-snow]:inline-flex [&_.ql-toolbar.ql-snow]:items-center [&_.ql-toolbar.ql-snow]:gap-1 [&_.ql-toolbar.ql-snow]:rounded-[8px] [&_.ql-toolbar.ql-snow]:border-0 [&_.ql-toolbar.ql-snow]:bg-[#d9dde3] [&_.ql-toolbar.ql-snow]:px-2 [&_.ql-toolbar.ql-snow]:py-1.5 [&_.ql-toolbar.ql-snow+_.ql-container.ql-snow]:!border-t [&_.ql-toolbar.ql-snow+_.ql-container.ql-snow]:!border-t-gray-300">
      <div ref={editorRef} />
    </div>
  );
};

export default DocumentCollabEditor;
