import { Client } from '../../core';
import { httpFetch } from '../../shared/fetch';
import { generateUrl } from '../../shared/utils';
import { paths } from '../models/api';
import { Invoice } from '../models/invoice';
import { BILLING_ENDPOINT } from './constants';
import { InvoiceConverter } from './InvoiceConverter';

const PATH = '/invoices/{invoice_id}';

type GetInvoiceOperation = paths[typeof PATH];
// TODO: Response should be specified for 200 response in OpenAPI
export type GetInvoiceResponse = GetInvoiceOperation['get']['responses'][403]['content']['application/json'];

export type GetInvoiceParameters = paths[typeof PATH]['parameters']['path'];

export const getInvoice = async (
  client: Client,
  params: GetInvoiceParameters
): Promise<Invoice> => {
  const url = `${client.getApiUrl()}${BILLING_ENDPOINT}${generateUrl(
    PATH,
    params
  )}`;

  const headers = client.getAuthorizationHeader();

  const fetchResponse = await httpFetch<GetInvoiceResponse>(url, {
    headers,
  });

  return InvoiceConverter.convert(fetchResponse);
};
