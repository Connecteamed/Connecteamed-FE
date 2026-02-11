import type QuillType from 'quill';

export type PresenceUser = { userId?: string; userName?: string };

export type CollabCallbacks = {
  onLog?: (msg: string) => void;
  onConnectedChange?: (connected: boolean) => void;
  onPresence?: (users: PresenceUser[]) => void;
};

export type ConnectArgs = {
  docId: string | number;
  textKey?: string;
  token: string;
  userName: string;
  quill: QuillType;
  wsBase?: string;
  callbacks?: CollabCallbacks;
};
