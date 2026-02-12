function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function formatMMDD(dateLike?: string | Date | null) {
  if (!dateLike) return '';
  const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
  if (Number.isNaN(d.getTime())) return '';
  return `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
}

export function calcTaskStatus(input: { status?: string; startDate?: string } | string) {
  if (typeof input === 'string') {
    return '시작 전' as const;
  }

  const raw = (input.status ?? '').toUpperCase();

  if (raw === 'TODO') return '시작 전' as const;
  if (raw === 'IN_PROGRESS') return '진행 중' as const;

  if (input.startDate) {
    const sd = new Date(input.startDate);
    if (!Number.isNaN(sd.getTime())) {
      return Date.now() < sd.getTime() ? ('시작 전' as const) : ('진행 중' as const);
    }
  }

  return '시작 전' as const;
}
