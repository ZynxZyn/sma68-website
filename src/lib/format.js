const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTHS_FULL_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatDateID(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getDate()} ${MONTHS_FULL_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateShortID(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateMonthShort(value) {
  if (!value) return { day: '--', month: '---' };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { day: '--', month: '---' };
  return { day: d.getDate(), month: MONTHS_ID[d.getMonth()].toUpperCase() };
}