import { useEffect, useMemo, useRef, useState } from 'react';

import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';

import { CollabClient } from '@/lib/collab/collabClient';
import type { PresenceUser } from '@/lib/collab/types';

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

const toDisplayName = (user: PresenceUser) => {
  const raw =
    user.userName ??
    user.memberName ??
    user.name ??
    user.loginId ??
    user.userId ??
    user.memberId;
  if (raw === null || raw === undefined) return '';
  return String(raw).trim();
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
  const [connected, setConnected] = useState(false);
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const [statusLog, setStatusLog] = useState('');

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!editorRef.current) return;
    const client = clientRef.current;

    const q = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ header: [1, 2, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
        cursors: {
          hideDelayMs: 600000,
          hideSpeedMs: 0,
          transformOnTextChange: true,
        },
      },
    });

    q.root.style.minHeight = '320px';
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
      setConnected(false);
      setPresence([]);
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
      callbacks: {
        onConnectedChange: setConnected,
        onPresence: setPresence,
        onLog: setStatusLog,
      },
    });

    return () => {
      client.disconnect({ quill: q, skipSnapshot: false, keepEditorEnabled: true });
      q.enable(true);
      setConnected(false);
      setPresence([]);
    };
  }, [canCollab, docId, token, userName, wsBase]);

  const presenceNames = useMemo(() => {
    const names = presence
      .map((user) => toDisplayName(user))
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set(names));
  }, [presence]);
  const effectiveConnected = canCollab && connected;
  const effectivePresenceNames = canCollab ? presenceNames : [];

  return (
    <div className="space-y-2">
      {collabEnabled && (
        <div className="rounded-[10px] bg-neutral-10 px-3 py-2">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-block h-2 w-2 rounded-full ${effectiveConnected ? 'bg-success' : 'bg-neutral-60'}`}
            />
            <span className={effectiveConnected ? 'text-primary-500' : 'text-neutral-70'}>
              {effectiveConnected ? '실시간 연결됨' : '연결 대기 중'}
            </span>
            <span className="text-neutral-70">({effectivePresenceNames.length}명)</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {effectivePresenceNames.length > 0 ? (
              effectivePresenceNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-90 outline outline-1 outline-offset-[-1px] outline-gray-300"
                >
                  {name}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-neutral-70">접속자 없음</span>
            )}
          </div>
        </div>
      )}
      {collabEnabled && statusLog && <div className="text-[11px] text-neutral-60">{statusLog}</div>}
      <div className="overflow-hidden rounded-[10px] bg-white outline outline-1 outline-offset-[-1px] outline-gray-300">
        <div ref={editorRef} />
      </div>
    </div>
  );
};

export default DocumentCollabEditor;
