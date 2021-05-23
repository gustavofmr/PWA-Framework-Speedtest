import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { ApiClientProvider } from '../../core/context';
import { useGetInvoice } from './useGetInvoice';

jest.mock('../requests/getInvoice.ts');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getInvoice } = require('../requests/getInvoice');
getInvoice.mockImplementation(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new Promise(() => {});
});

describe('useGetInvoice', () => {
  beforeEach(() => {
    getInvoice.mockClear();
  });
  it('should instantly start loading the resource', () => {
    const { result } = renderHook(() =>
      useGetInvoice({
        invoice_id: '2',
      })
    );

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
    expect(getInvoice).toHaveBeenCalledWith(jasmine.anything(), {
      invoice_id: '2',
    });
  });

  it('should use provided by context API client', () => {
    const wrapper = ({ children }) => (
      <ApiClientProvider apiUrl="test-api">{children}</ApiClientProvider>
    );

    const { result } = renderHook(
      () =>
        useGetInvoice({
          invoice_id: '2',
        }),
      { wrapper }
    );

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
    expect(getInvoice.mock.calls[0][0].apiUrl).toEqual('test-api');
  });

  it('should return data after call succeed', async () => {
    getInvoice.mockImplementation(() => {
      return Promise.resolve({
        pdfHref: 'pdf',
      });
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useGetInvoice({
        invoice_id: '2',
      })
    );

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: { pdfHref: 'pdf' },
    });
  });

  it('should return error state on failure', async () => {
    getInvoice.mockImplementation(() => {
      return Promise.reject('sample error');
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useGetInvoice({
        invoice_id: '2',
      })
    );

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: 'sample error',
      loading: false,
      data: null,
    });
  });
});
