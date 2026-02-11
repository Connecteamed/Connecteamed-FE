import { useCallback, useMemo, useState } from 'react';

import iconArrowLeftBlack from '@assets/icon-arrow-left-black.svg';

import DocumentCollabEditor from './DocumentCollabEditor';
import { useSidebarWidth } from '../hooks/useSidebarWidth';

type TextEditorProps = {
  onBack: () => void;

  initialTitle?: string;
  initialContent?: string;
  submitLabel?: string;
  onSave: (payload: { title: string; content: string }) => void;
  collabDocId?: number | null;

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

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const readLoginIdFromClaims = (claims: Record<string, unknown> | null) => {
  if (!claims) return '';
  const candidates = [
    claims.loginId,
    claims.preferred_username,
    claims.userId,
    claims.sub,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  return '';
};

const normalizeEnv = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^['"]|['"]$/g, '');
};

const normalizeWsScheme = (rawBase: string) => {
  if (!rawBase.startsWith('ws://')) return rawBase;
  if (
    rawBase.startsWith('ws://localhost') ||
    rawBase.startsWith('ws://127.0.0.1') ||
    rawBase.startsWith('ws://0.0.0.0')
  ) {
    return rawBase;
  }
  return rawBase.replace(/^ws:\/\//, 'wss://');
};

const resolveWsBase = () => {
  const explicitWsBase = normalizeEnv(
    import.meta.env.VITE_SERVER_WS_URL ?? import.meta.env.VITE_WS_BASE_URL,
  );
  if (explicitWsBase) return normalizeWsScheme(explicitWsBase.replace(/\/$/, ''));

  const apiBase = normalizeEnv(import.meta.env.VITE_SERVER_API_URL ?? import.meta.env.VITE_API_BASE_URL);
  if (!apiBase) return undefined;

  const normalized = apiBase.replace(/\/api\/?$/, '').replace(/\/$/, '');
  if (normalized.startsWith('https://')) return normalized.replace(/^https:/, 'wss:');
  if (normalized.startsWith('http://')) return normalized.replace(/^http:/, 'ws:');
  return normalized;
};

const TextEditorInner: React.FC<TextEditorProps> = ({
  onBack,
  initialTitle = '',
  initialContent = '',
  submitLabel = '저장하기',
  onSave,
  collabDocId = null,
  sidebarSelector = 'aside',
  fallbackSidebarWidth = 260,
}) => {
  const sidebarWidth = useSidebarWidth({ sidebarSelector, fallbackSidebarWidth });

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(() => ensureHtmlContent(initialContent));

  const collabToken = useMemo(() => localStorage.getItem('accessToken') ?? '', []);
  const collabUserName = useMemo(() => {
    const loginId = localStorage.getItem('loginId');
    if (loginId?.trim()) return loginId.trim();

    const fromToken = readLoginIdFromClaims(decodeJwtPayload(collabToken));
    if (fromToken) return fromToken;

    const memberId = localStorage.getItem('memberId');
    if (memberId?.trim()) return `user-${memberId.trim()}`;

    return '사용자';
  }, [collabToken]);
  const wsBase = useMemo(() => resolveWsBase(), []);
  const collabEnabled = Boolean(collabDocId && collabDocId > 0);

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

                <DocumentCollabEditor
                  value={content}
                  onChange={setContent}
                  collabEnabled={collabEnabled}
                  docId={collabDocId}
                  token={collabToken || undefined}
                  userName={collabUserName}
                  wsBase={wsBase}
                  placeholder="내용을 입력하세요"
                />
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
    </div>
  );
};

const TextEditor: React.FC<TextEditorProps> = (props) => {
  const key = `${props.collabDocId ?? 'new'}__${props.initialTitle ?? ''}__${props.initialContent ?? ''}`;
  return <TextEditorInner key={key} {...props} />;
};

export default TextEditor;
