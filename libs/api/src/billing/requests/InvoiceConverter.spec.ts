import dayjs from 'dayjs';
import faker from 'faker';
import Mockdate from 'mockdate';
import { InvoiceStatus } from '../models/invoice';
import { ApiInvoice, InvoiceConverter } from './InvoiceConverter';

describe('InvoiceConverter', () => {
  describe('convert', () => {
    test('should convert response field due_date to invoice data field dueDate', () => {
      const testData = makeTestServiceInvoiceData();
      const invoiceData = InvoiceConverter.convert(testData);

      expect(invoiceData.dueDate).toStrictEqual(dayjs(testData.due_date));
    });
    test('should convert response field invoice_amount to invoice data field invoiceAmount', () => {
      const testData = makeTestServiceInvoiceData();
      const invoiceData = InvoiceConverter.convert(testData);

      expect(invoiceData.invoiceAmount.value).toStrictEqual(
        testData.invoice_amount.value
      );
    });
    describe('should set status to', () => {
      beforeEach(() => {
        Mockdate.set(new Date());
      });

      afterEach(() => {
        Mockdate.reset();
      });

      test('PAID if invoice was paid', () => {
        const testData = makeTestServiceInvoiceData({ isSettled: true });
        const invoice = InvoiceConverter.convert(testData);

        expect(invoice.status).toEqual(InvoiceStatus.PAID);
      });
      test('ISSUED if invoice was not paid and due date equals current date', () => {
        const testData = makeTestServiceInvoiceData({
          isSettled: false,
          dueDate: dayjs(),
        });
        const invoice = InvoiceConverter.convert(testData);

        expect(invoice.status).toStrictEqual(InvoiceStatus.ISSUED);
      });
      test('ISSUED if invoice was not paid and due date is greater than current date', () => {
        const invoiceData = makeTestServiceInvoiceData({
          isSettled: false,
          dueDate: dayjs().add(100, 'year'),
        });
        const invoice = InvoiceConverter.convert(invoiceData);

        expect(invoice.status).toEqual(InvoiceStatus.ISSUED);
      });
      test('OVERDUE if invoice was not paid and current date is greater than due date', () => {
        const invoiceData = makeTestServiceInvoiceData({
          isSettled: false,
          dueDate: dayjs().subtract(30, 'day'),
        });
        const invoice = InvoiceConverter.convert(invoiceData);

        expect(invoice.status).toEqual(InvoiceStatus.OVERDUE);
      });
    });
  });
});

function makeTestServiceInvoiceData({
  isSettled = faker.random.boolean(),
  dueDate = dayjs().add(faker.random.number(30), 'day'),
} = {}): ApiInvoice {
  return {
    amount_due: makeTestMoneyAmount(),
    invoice_id: faker.random.word(),
    pdf: { href: faker.random.words() },
    invoice_amount: makeTestMoneyAmount(),
    previous_balance: makeTestMoneyAmount(),
    is_settled: isSettled,
    due_date: dueDate ? dueDate.toISOString() : faker.date.soon().toISOString(),
    sequence_number: faker.random.number(),
    issued_date: faker.date.soon().toISOString(),
    billing_cycle_start_date: faker.date.soon().toISOString(),
  };

  function makeTestMoneyAmount() {
    return {
      value: faker.random.number(),
      currency: 'EUR',
    };
  }
}
