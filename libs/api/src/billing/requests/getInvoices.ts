import { Client } from '../../core';
import { paths } from '../models/api';
import { Invoice } from '../models/invoice';
import { BILLING_ENDPOINT } from './constants';
import { httpFetch } from '../../shared/fetch';
import { generateUrl } from '../../shared/utils';
import { InvoiceConverter } from './InvoiceConverter';

const PATH = '/invoices';

type GetInvoicesOperation = paths[typeof PATH];
type GetInvoicesResponse = GetInvoicesOperation['get']['responses'][200]['content']['application/json'];

export type GetInvoicesItem = GetInvoicesResponse['items'][0];

export const getInvoices = async (
  client: Client,
  params: GetInvoicesOperation['get']['parameters']['query'] = {}
): Promise<Invoice[]> => {
  const url = `${client.getApiUrl()}${BILLING_ENDPOINT}${generateUrl(
    PATH,
    params
  )}`;

  const headers = client.getAuthorizationHeader();
  if (params.account_id) {
    headers.append('X-Viasat-User', params.account_id);
  }

  const fetchResponse = await httpFetch<GetInvoicesResponse>(url, {
    headers,
  });

  return fetchResponse?.items?.map(InvoiceConverter.convert);
};
