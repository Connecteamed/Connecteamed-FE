import type QuillType from 'quill';
import type { Awareness } from 'y-protocols/awareness';

type CursorState = {
  index: number;
  length: number;
};

type AwarenessState = {
  user?: { name?: string; color?: string };
  cursor?: CursorState;
};

type QuillCursorModule = {
  clearCursors: () => void;
  createCursor: (id: string, name: string, color: string) => void;
  moveCursor: (id: string, range: CursorState) => void;
};

export function renderRemoteCursors(quill: QuillType, awareness: Awareness) {
  const cursors = quill.getModule('cursors') as QuillCursorModule | undefined;
  if (!cursors) return;

  const states = awareness.getStates();
  cursors.clearCursors();

  states.forEach((state, clientId) => {
    if (clientId === awareness.clientID) return; // 내 커서 제외

    const parsed = state as AwarenessState;
    if (!parsed.user || !parsed.cursor) return;

    const name = parsed.user.name || 'user';
    const color = parsed.user.color || '#4f46e5';
    const { index, length } = parsed.cursor;

    cursors.createCursor(String(clientId), name, color);
    cursors.moveCursor(String(clientId), { index, length });
  });
}
