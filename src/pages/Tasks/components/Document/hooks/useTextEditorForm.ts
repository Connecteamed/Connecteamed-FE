import { useCallback, useMemo } from 'react';

type SavePayload = { title: string; content: string };

type Options = {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  onSave: (payload: SavePayload) => void;
};

function stripHtmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const useTextEditorForm = ({ title, content, onSave }: Options) => {
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

  return { canSubmit, submit };
};
