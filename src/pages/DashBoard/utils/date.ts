import { format, isValid } from 'date-fns';

/*
ISO 날짜 → MM.dd 포맷
*/
export function formatMMDD(iso: string | Date) {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (!isValid(d)) return '';
  return format(d, 'MM.dd');
}

/*
업무 상태 계산
*/
export function calcTaskStatus(writtenDate: string): '시작 전' | '진행 중' {
  const d = new Date(writtenDate);
  if (!isValid(d)) return '진행 중';

  return d.getTime() > Date.now() ? '시작 전' : '진행 중';
}
