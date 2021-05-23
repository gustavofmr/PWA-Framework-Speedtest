import dayjs from 'dayjs';

interface IFormatDateArgs {
  date: dayjs.Dayjs;
  format?: 'DD-MM-YYYY';
}

export function formatDate({
  date,
  format = 'DD-MM-YYYY',
}: IFormatDateArgs): string {
  return date.format(format);
}
