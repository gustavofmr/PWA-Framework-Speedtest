import dayjs from 'dayjs';
import { Invoice, InvoiceStatus } from '../models/invoice';
import { GetInvoiceResponse } from './getInvoice';
import { GetInvoicesItem } from './getInvoices';

export type ApiInvoice = GetInvoicesItem | GetInvoiceResponse;

export class InvoiceConverter {
  public static convert(data: ApiInvoice): Invoice {
    const now = dayjs();
    const { is_settled, due_date } = data;
    const dueDate = dayjs(due_date ? due_date : undefined);

    let status;
    if (is_settled) {
      status = InvoiceStatus.PAID;
    } else if (now.isBefore(dueDate) || now.isSame(dueDate)) {
      status = InvoiceStatus.ISSUED;
    } else {
      status = InvoiceStatus.OVERDUE;
    }

    const issuedDate = dayjs(data.issued_date ? data.issued_date : undefined);

    return {
      pdfHref: data.pdf.href,
      dueDate,
      invoiceId: data.invoice_id ?? '',
      isSettled: !!data.is_settled,
      issuedDate,
      status,
      amountDue: data.amount_due,
      invoiceAmount: data.invoice_amount,
      previousBalance: data.previous_balance,
    };
  }
}
