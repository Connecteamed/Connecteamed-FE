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
  payload?: unknown;
};

export class CollabClient {
  private ws: WebSocket | null = null;
  private ydoc: Y.Doc | null = null;
  private awareness: awarenessProtocol.Awareness | null = null;
  private binding: QuillBinding | null = null;

  private onAwarenessUpdate:
    | ((changes: AwarenessChanges, origin: unknown) => void)
    | null = null;
  private onAwarenessRender: ((changes: AwarenessChanges, origin: unknown) => void) | null = null;
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
      this.onAwarenessRender = () => {
        if (!this.awareness) return;
        renderRemoteCursors(quill, this.awareness);
      };
      this.awareness?.on('update', this.onAwarenessRender);

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
        const updates = this.parseInitialUpdates(msg.payload);
        if (!updates.length) return;

        this.ydoc.transact(() => {
          updates.forEach((item) => {
            try {
              Y.applyUpdate(this.ydoc as Y.Doc, fromBase64(item), 'ws');
            } catch {
              // ignore invalid update
            }
          });
        }, 'ws');
        return;
      }

      if (msg.type === 'UPDATE') {
        if (typeof msg.payload !== 'string' || !msg.payload) return;
        try {
          Y.applyUpdate(this.ydoc, fromBase64(msg.payload), 'ws');
        } catch {
          // ignore invalid payload
        }
        return;
      }

      if (msg.type === 'AWARENESS') {
        const encoded = this.extractEncodedPayload(msg.payload);
        if (!encoded) return;
        try {
          awarenessProtocol.applyAwarenessUpdate(this.awareness, fromBase64(encoded), 'ws');
          renderRemoteCursors(quill, this.awareness);
        } catch {
          // ignore invalid payload
        }
        return;
      }

      if (msg.type === 'PRESENCE_UPDATE') {
        callbacks?.onPresence?.(this.parsePresencePayload(msg.payload));
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
      if (this.awareness && this.onAwarenessRender) {
        this.awareness.off('update', this.onAwarenessRender);
      }
    } catch {
      // ignore cleanup error
    }
    this.onAwarenessRender = null;

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

  private parseInitialUpdates(payload: unknown): string[] {
    const updates: string[] = [];

    const collect = (value: unknown) => {
      if (typeof value === 'string' && value.length > 0) {
        updates.push(value);
      }
    };

    if (Array.isArray(payload)) {
      payload.forEach(collect);
      return updates;
    }

    if (typeof payload !== 'string') return updates;
    const trimmed = payload.trim();
    if (!trimmed) return updates;

    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        parsed.forEach(collect);
      } else {
        collect(parsed);
      }
    } catch {
      collect(trimmed);
    }

    return updates;
  }

  private parsePresencePayload(payload: unknown): PresenceUser[] {
    const toUsers = (value: unknown): PresenceUser[] => {
      if (Array.isArray(value)) {
        return value.filter(
          (user): user is PresenceUser => Boolean(user) && typeof user === 'object',
        );
      }

      if (value && typeof value === 'object') {
        const users = (value as Record<string, unknown>).users;
        if (Array.isArray(users)) {
          return users.filter(
            (user): user is PresenceUser => Boolean(user) && typeof user === 'object',
          );
        }
      }

      return [];
    };

    if (typeof payload === 'string') {
      const trimmed = payload.trim();
      if (!trimmed) return [];
      try {
        return toUsers(JSON.parse(trimmed) as unknown);
      } catch {
        return [];
      }
    }

    return toUsers(payload);
  }

  private extractEncodedPayload(payload: unknown): string | null {
    if (typeof payload === 'string') {
      const trimmed = payload.trim();
      return trimmed.length ? trimmed : null;
    }

    if (!payload || typeof payload !== 'object') return null;
    const record = payload as Record<string, unknown>;
    const candidate = record.payload ?? record.content ?? record.update;
    if (typeof candidate !== 'string') return null;
    const trimmed = candidate.trim();
    return trimmed.length ? trimmed : null;
  }

  private safeSend(obj: Record<string, unknown>) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(obj));
  }
}
