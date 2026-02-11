import type QuillType from 'quill';

export type PresenceUser = {
  userId?: string | number;
  userName?: string;
  memberId?: string | number;
  memberName?: string;
  name?: string;
  loginId?: string;
};

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
