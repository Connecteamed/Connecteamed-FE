import { useCallback, useEffect, useMemo, useState } from 'react';

type SavePayload = { title: string; content: string };

type Options = {
  initialTitle?: string;
  initialContent?: string;
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

export const useTextEditorForm = ({ initialTitle = '', initialContent = '', onSave }: Options) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => setTitle(initialTitle), [initialTitle]);
  useEffect(() => setContent(initialContent), [initialContent]);

  const trimmedTitle = useMemo(() => title.trim(), [title]);
  const contentText = useMemo(() => stripHtmlToText(content), [content]);

  const canSubmit = useMemo(
    () => trimmedTitle.length > 0 && contentText.length > 0,
    [trimmedTitle, contentText],
  );

  const submit = useCallback(() => {
    if (!canSubmit) return;
    onSave({ title: trimmedTitle, content }); // content는 HTML 그대로 저장(서식 유지)
  }, [canSubmit, onSave, trimmedTitle, content]);

  return { title, setTitle, content, setContent, canSubmit, submit };
};
