import type QuillType from 'quill';
import * as awarenessProtocol from 'y-protocols/awareness';
import { QuillBinding } from 'y-quill';
import * as Y from 'yjs';

import { renderRemoteCursors } from './cursors';
import type { ConnectArgs, PresenceUser } from './types';
import { fromBase64, toBase64 } from './utils';

type AwarenessChanges = {
  added: number[];
  updated: number[];
  removed: number[];
};

type WsInboundMessage = {
  type: string;
  payload?: string;
};

export class CollabClient {
  private ws: WebSocket | null = null;
  private ydoc: Y.Doc | null = null;
  private awareness: awarenessProtocol.Awareness | null = null;
  private binding: QuillBinding | null = null;

  private onAwarenessUpdate:
    | ((changes: AwarenessChanges, origin: unknown) => void)
    | null = null;
  private onYDocUpdate: ((update: Uint8Array, origin: unknown) => void) | null = null;
  private docId = '';
  private messageDocId: string | number = '';

  connect(args: ConnectArgs) {
    const {
      docId,
      textKey = 'content',
      token,
      userName,
      quill,
      wsBase = 'ws://localhost:8080',
      callbacks,
    } = args;

    this.disconnect({ quill, skipSnapshot: true, keepEditorEnabled: true });

    this.docId = String(docId);
    const numericDocId = Number(docId);
    this.messageDocId =
      Number.isFinite(numericDocId) && numericDocId > 0 ? numericDocId : String(docId);
    quill.enable(false);

    this.ydoc = new Y.Doc();
    const ytext = this.ydoc.getText(textKey);

    this.awareness = new awarenessProtocol.Awareness(this.ydoc);
    const myColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;
    this.awareness.setLocalStateField('user', { name: userName, color: myColor });

    this.binding = new QuillBinding(ytext, quill);

    const normalizedBase = wsBase.replace(/\/$/, '');
    const ws = new WebSocket(
      `${normalizedBase}/ws/docs/${this.docId}?token=${encodeURIComponent(token)}`,
    );
    this.ws = ws;

    ws.onopen = () => {
      if (this.ws !== ws) return;

      callbacks?.onConnectedChange?.(true);
      callbacks?.onLog?.('Connected');
      quill.enable(true);
      this.safeSend({ type: 'JOIN', docId: this.messageDocId });

      this.onAwarenessUpdate = (changes, origin) => {
        if (origin === 'remote') return;
        const changed = changes.added.concat(changes.updated).concat(changes.removed);
        if (!changed.length || !this.awareness) return;

        const encoded = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changed);
        this.safeSend({ type: 'AWARENESS', docId: this.messageDocId, payload: toBase64(encoded) });
      };
      this.awareness?.on('update', this.onAwarenessUpdate);

      this.onYDocUpdate = (update, origin) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        if (origin === 'ws' || origin === 'sys') return;
        this.safeSend({ type: 'UPDATE', docId: this.messageDocId, payload: toBase64(update) });
      };
      this.ydoc?.on('update', this.onYDocUpdate);
    };

    ws.onmessage = (event) => {
      if (this.ws !== ws) return;

      let msg: WsInboundMessage;
      try {
        msg = JSON.parse(String(event.data)) as WsInboundMessage;
      } catch {
        return;
      }

      if (!this.ydoc || !this.awareness) return;

      if (msg.type === 'INITIAL_LOAD') {
        const payload = msg.payload ?? '[]';
        try {
          const parsed = JSON.parse(payload) as unknown;
          this.ydoc.transact(() => {
            if (Array.isArray(parsed)) {
              parsed.forEach((item) => {
                if (typeof item === 'string' && item.length > 0) {
                  Y.applyUpdate(this.ydoc as Y.Doc, fromBase64(item), 'ws');
                }
              });
              return;
            }

            if (typeof parsed === 'string' && parsed.length > 0) {
              Y.applyUpdate(this.ydoc as Y.Doc, fromBase64(parsed), 'ws');
            }
          }, 'ws');
        } catch {
          // ignore invalid payload
        }
        return;
      }

      if (msg.type === 'UPDATE') {
        if (!msg.payload) return;
        try {
          Y.applyUpdate(this.ydoc, fromBase64(msg.payload), 'ws');
        } catch {
          // ignore invalid payload
        }
        return;
      }

      if (msg.type === 'AWARENESS') {
        if (!msg.payload) return;
        try {
          awarenessProtocol.applyAwarenessUpdate(this.awareness, fromBase64(msg.payload), 'ws');
          renderRemoteCursors(quill, this.awareness);
        } catch {
          // ignore invalid payload
        }
        return;
      }

      if (msg.type === 'PRESENCE_UPDATE') {
        try {
          callbacks?.onPresence?.(JSON.parse(msg.payload || '[]') as PresenceUser[]);
        } catch {
          callbacks?.onPresence?.([]);
        }
      }
    };

    ws.onclose = (event) => {
      if (this.ws !== ws) return;

      callbacks?.onConnectedChange?.(false);
      callbacks?.onLog?.(
        event.reason
          ? `Disconnected (${event.code}: ${event.reason})`
          : `Disconnected (${event.code})`,
      );
      this.ws = null;
      this.teardown({ quill, keepEditorEnabled: true });
    };

    ws.onerror = () => {
      if (this.ws !== ws) return;

      callbacks?.onLog?.('WebSocket error');
    };
  }

  sendSnapshot(quill: QuillType) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.ydoc) return;

    const stateUpdate = Y.encodeStateAsUpdate(this.ydoc);
    this.safeSend({
      type: 'SAVE_SNAPSHOT',
      docId: this.messageDocId,
      payload: quill.getText(),
      content: toBase64(stateUpdate),
    });
  }

  disconnect({
    quill,
    skipSnapshot,
    keepEditorEnabled = false,
  }: {
    quill: QuillType;
    skipSnapshot: boolean;
    keepEditorEnabled?: boolean;
  }) {
    try {
      if (!skipSnapshot) this.sendSnapshot(quill);
    } catch {
      // snapshot is best-effort
    }

    this.closeSocket();
    this.teardown({ quill, keepEditorEnabled });
  }

  getAwareness() {
    return this.awareness;
  }

  private teardown({
    quill,
    keepEditorEnabled,
  }: {
    quill: QuillType;
    keepEditorEnabled: boolean;
  }) {
    try {
      if (this.awareness && this.onAwarenessUpdate) {
        this.awareness.off('update', this.onAwarenessUpdate);
      }
    } catch {
      // ignore cleanup error
    }
    this.onAwarenessUpdate = null;

    try {
      if (this.ydoc && this.onYDocUpdate) {
        this.ydoc.off('update', this.onYDocUpdate);
      }
    } catch {
      // ignore cleanup error
    }
    this.onYDocUpdate = null;

    try {
      this.binding?.destroy();
    } catch {
      // ignore cleanup error
    }
    this.binding = null;

    try {
      this.awareness?.destroy();
    } catch {
      // ignore cleanup error
    }
    this.awareness = null;

    try {
      this.ydoc?.destroy();
    } catch {
      // ignore cleanup error
    }
    this.ydoc = null;

    if (!keepEditorEnabled) {
      try {
        quill.enable(false);
      } catch {
        // ignore cleanup error
      }
    }
  }

  private closeSocket() {
    if (!this.ws) return;

    const ws = this.ws;
    this.ws = null;
    const prevOnOpen = ws.onopen;
    ws.onmessage = null;
    ws.onclose = null;
    ws.onerror = null;

    // In dev (StrictMode) cleanup can happen while the socket is still CONNECTING.
    // Closing at that moment prints a noisy browser warning even though behavior is expected.
    if (ws.readyState === WebSocket.CONNECTING) {
      ws.onopen = () => {
        try {
          ws.close();
        } catch {
          // ignore close error
        }
      };
      return;
    }

    ws.onopen = prevOnOpen;
    try {
      ws.close();
    } catch {
      // ignore close error
    }
  }

  private safeSend(obj: Record<string, unknown>) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(obj));
  }
}
