import { formatMoney } from './money';
describe('formatMoney', () => {
  describe('given 123 EURO cents', () => {
    test('should return 1,23 €', () => {
      const formatted = formatMoney({
        value: 123,
        currency: 'EUR',
      });

      expect(formatted).toEqual('1,23 €');
    });
  });

  describe('given 4999 EURO cents', () => {
    test('should return 49,99 €', () => {
      const formatted = formatMoney({
        value: 4999,
        currency: 'EUR',
      });

      expect(formatted).toEqual('49,99 €');
    });
  });

  describe('given 0 EURO cents', () => {
    test('should return 0 €', () => {
      const formatted = formatMoney({
        value: 0,
        currency: 'EUR',
      });

      expect(formatted).toEqual('0,00 €');
    });
  });
});
