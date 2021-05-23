import { renderHook } from '@testing-library/react-hooks';
import React, { useContext, useEffect } from 'react';
import { ApiClientContext, ApiClientProvider } from '../../core/context';
import { useGetInvoices } from './useGetInvoices';

jest.mock('../requests/getInvoices.ts');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getInvoices } = require('../requests/getInvoices');
getInvoices.mockImplementation(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new Promise(() => {});
});

const viasatId = 'vstId';

const ViasatIdProvider = ({ children }) => {
  const { setViasatId } = useContext(ApiClientContext);
  useEffect(() => {
    setViasatId(viasatId);
  }, []);

  return children;
};

const wrapper = ({ children }) => (
  <ApiClientProvider apiUrl="test-api">
    <ViasatIdProvider>{children}</ViasatIdProvider>
  </ApiClientProvider>
);

describe('useGetInvoices', () => {
  beforeEach(() => {
    getInvoices.mockClear();
  });

  it('should not load anything without account_id', () => {
    const { result } = renderHook(() => useGetInvoices());

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: null,
    });
    expect(getInvoices).not.toHaveBeenCalled();
  });

  it('should instantly start loading the resources', () => {
    const { result } = renderHook(() => useGetInvoices(), { wrapper });

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
    expect(getInvoices).toHaveBeenCalledWith(jasmine.anything(), {
      account_id: 'vstId',
    });
  });

  it('should use provided by context API client', () => {
    const { result } = renderHook(() => useGetInvoices(), { wrapper });

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
    expect(getInvoices.mock.calls[0][0].apiUrl).toEqual('test-api');
  });

  it('should return data after call succeed', async () => {
    getInvoices.mockImplementation(() => {
      return Promise.resolve([
        {
          pdfHref: 'pdf',
        },
      ]);
    });

    const { result, waitForNextUpdate } = renderHook(() => useGetInvoices(), {
      wrapper,
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: [{ pdfHref: 'pdf' }],
    });
  });

  it('should return error state on failure', async () => {
    getInvoices.mockImplementation(() => {
      return Promise.reject('sample error');
    });

    const { result, waitForNextUpdate } = renderHook(() => useGetInvoices(), {
      wrapper,
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: 'sample error',
      loading: false,
      data: null,
    });
  });
});
