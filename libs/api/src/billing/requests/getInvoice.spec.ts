import { Client } from '../../core/client';
import { getInvoice } from './getInvoice';

jest.mock('../../shared/fetch.ts');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { httpFetch } = require('../../shared/fetch');

httpFetch.mockImplementation(() => {
  return Promise.resolve({
    pdf: { href: 'pdfHref' },
    amount_due: {
      value: 20,
    },
    invoice_amount: {},
    previous_balance: {},
  });
});

let authHeader;
let client;

describe('getInvoice', () => {
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
  it('should call invoices endpoint with passed invoice id', async () => {
    await getInvoice(client, { invoice_id: '2' });
    expect(httpFetch.mock.calls[0][0]).toEqual('api/billing/invoices/2');
  });

  it('should pass the result through converter', async () => {
    const result = await getInvoice(client, { invoice_id: '2' });
    expect(result.pdfHref).toEqual('pdfHref');
  });

  it('should pass Authorization header', async () => {
    await getInvoice(client, { invoice_id: '2' });
    expect(httpFetch.mock.calls[0][1]).toEqual({ headers: authHeader });
  });
});
