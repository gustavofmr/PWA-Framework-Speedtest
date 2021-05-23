import { Client } from '../../core';
import { generateUrl } from '../../shared/utils';
import { paths } from '../models/api';
import { InvoicePaymentLink } from '../models/invoice';
import { BILLING_ENDPOINT } from './constants';

const PATH = '/transactions';

type GetInvoiceOperation = paths[typeof PATH];
export type PostInvoiceResponse = GetInvoiceOperation['post']['responses'][201]['content']['application/json'];

export const getPaymentLink = async (
  client: Client,
  invoiceId: string,
  languageCode: string
): Promise<InvoicePaymentLink> => {
  const url = `${client.getApiUrl()}${BILLING_ENDPOINT}${generateUrl(
    PATH,
    {}
  )}`;

  const headers = client.getAuthorizationHeader();
  headers.append('Content-Type', 'application/json');

  const fetchResponse = (await (
    await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        invoice_numbers: [invoiceId],
        language_code: languageCode,
      }),
    })
  ).json()) as PostInvoiceResponse;

  return { url: fetchResponse.iframe_url };
};
