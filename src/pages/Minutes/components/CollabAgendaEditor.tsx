import { useEffect, useMemo, useRef, useState } from 'react';

import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';

import { CollabClient } from '@/lib/collab/collabClient';
import type { PresenceUser } from '@/lib/collab/types';

type QuillSelection = { index: number; length: number } | null;

interface CollabAgendaEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
  collabEnabled: boolean;
  docId?: string | number;
  textKey?: string;
  token?: string;
  userName?: string;
  wsBase?: string;
  placeholder?: string;
}

if (!Quill.imports['modules/cursors']) {
  Quill.register('modules/cursors', QuillCursors);
}

const normalizeQuillText = (text: string) => text.replace(/\n$/, '');

const CollabAgendaEditor = ({
  value,
  onChange,
  collabEnabled,
  docId,
  textKey,
  token,
  userName,
  wsBase,
  placeholder = '내용을 입력하세요',
}: CollabAgendaEditorProps) => {
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
    editorRef.current.innerHTML = '';

    const q = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
        cursors: true,
      },
    });

    q.root.style.minHeight = '160px';
    q.root.style.fontSize = '16px';
    q.root.style.fontWeight = '500';
    q.setText(valueRef.current || '');
    q.enable(true);

    const handleTextChange = () => {
      if (isSyncingFromValueRef.current) return;
      onChangeRef.current(normalizeQuillText(q.getText()));
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

    const current = normalizeQuillText(q.getText());
    const next = value || '';
    if (current === next) return;

    isSyncingFromValueRef.current = true;
    const selection = q.getSelection();
    q.setText(next, 'silent');
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

  const hasCollabPrerequisites = useMemo(() => {
    if (!collabEnabled) return false;
    if (!token || !userName) return false;
    if (docId === undefined || docId === null) return false;
    return String(docId).length > 0;
  }, [collabEnabled, docId, token, userName]);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    const client = clientRef.current;

    if (!hasCollabPrerequisites) {
      client.disconnect({ quill: q, skipSnapshot: false, keepEditorEnabled: true });
      q.enable(true);
      return;
    }

    client.connect({
      docId: String(docId),
      textKey,
      token,
      userName,
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
  }, [docId, hasCollabPrerequisites, textKey, token, userName, wsBase]);

  const connectedState = hasCollabPrerequisites ? connected : false;
  const presenceUsers = hasCollabPrerequisites ? presence : [];
  const presenceLabel =
    presenceUsers.length > 0
      ? presenceUsers.map((user) => user.userName ?? user.userId).filter(Boolean).join(', ')
      : '접속자 없음';

  return (
    <div className="space-y-2">
      {collabEnabled && (
        <div className="flex items-center justify-between text-xs">
          <span className={connectedState ? 'text-primary-500' : 'text-neutral-60'}>
            {connectedState ? '실시간 연결됨' : '연결 대기 중'}
          </span>
          <span className="text-neutral-70 truncate">접속자: {presenceLabel}</span>
        </div>
      )}
      {collabEnabled && statusLog && <div className="text-[11px] text-neutral-60">{statusLog}</div>}
      <div className="overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-neutral-50">
        <div ref={editorRef} />
      </div>
    </div>
  );
};

export default CollabAgendaEditor;
