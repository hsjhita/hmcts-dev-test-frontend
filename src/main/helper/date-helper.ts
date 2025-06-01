export function getFormattedDate() {
  const dateToFormat = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
  const [date, time] = dateToFormat.split(', ');
  return `${date.split('/').reverse().join('-')}T${time}`;
}
