import { Client } from '../../core/client';
// import { httpFetch } from '../../shared/fetch';
import { getInvoices } from './getInvoices';

jest.mock('../../shared/fetch.ts');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { httpFetch } = require('../../shared/fetch');

httpFetch.mockImplementation(() => {
  return Promise.resolve({
    items: [
      {
        pdf: { href: 'pdfHref' },
        amount_due: {
          value: 20,
        },
        invoice_amount: {},
        previous_balance: {},
      },
    ],
  });
});

let authHeader;
let client;

describe('getInvoices', () => {
  beforeEach(() => {
    authHeader = new Headers({
      Authorization: 'Bearer tok',
    });

    client = new Client({
      apiUrl: 'api',
      getAuthorizationHeader() {
        return authHeader;
      },
    });

    httpFetch.mockClear();
  });

  it('should call invoices endpoint with passed account id', async () => {
    await getInvoices(client, { account_id: '2' });
    expect(httpFetch.mock.calls[0][0]).toEqual(
      'api/billing/invoices?account_id=2'
    );
  });

  it('should pass the result through converter', async () => {
    const result = await getInvoices(client, { account_id: '2' });
    expect(result[0].pdfHref).toEqual('pdfHref');
  });

  it('should pass Authorization header and X-Viasat-User', async () => {
    await getInvoices(client, { account_id: '2' });
    expect(httpFetch.mock.calls[0][1]).toEqual({ headers: authHeader });
    expect(httpFetch.mock.calls[0][1].headers.get('X-Viasat-User')).toEqual(
      '2'
    );
  });

  it('should not set X-Viasat-User when account id not passed', async () => {
    await getInvoices(client);
    expect(httpFetch.mock.calls[0][1].headers.has('X-Viasat-User')).toBeFalsy();
  });
});
