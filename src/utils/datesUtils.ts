export function formatDate(date: string | null) {
  if (!date) return null;

  const timestamp = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const formattedDate = timestamp.format(new Date(date)).replace(/\//g, '.');

  return formattedDate;
}
