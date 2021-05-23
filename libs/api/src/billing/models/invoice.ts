import dayjs from 'dayjs';
import { components } from './api';

export type Money = components['schemas']['currency'];

export enum InvoiceStatus {
  PAID = 'PAID',
  ISSUED = 'ISSUED',
  OVERDUE = 'OVERDUE',
}

export interface Invoice {
  pdfHref: string;
  invoiceId: string;
  isSettled: boolean;
  dueDate: dayjs.Dayjs;
  amountDue?: Money;
  issuedDate: dayjs.Dayjs;
  invoiceAmount?: Money;
  previousBalance?: Money;
  status: InvoiceStatus;
}

export interface InvoicePaymentLink {
  url: string;
}
