import dayjs from 'dayjs';
import { formatDate } from './date';

describe('formatDate', () => {
  describe('given 2020-01-02 // YYYY-MM-DD', () => {
    test('should return 02-01-2020 // DD-MM-YYYY', () => {
      const formatted = formatDate({
        date: dayjs('2020-01-02'),
        format: 'DD-MM-YYYY',
      });

      expect(formatted).toEqual('02-01-2020');
    });
  });
});
