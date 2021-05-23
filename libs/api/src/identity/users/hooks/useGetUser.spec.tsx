import { renderHook } from '@testing-library/react-hooks';
import React, { useContext, useEffect } from 'react';
import { ApiClientContext, ApiClientProvider } from '../../../core/context';
import { useGetUser } from './useGetUser';

jest.mock('../requests/getUsers.ts');
const { getUsers } = require('../requests/getUsers.ts');
getUsers.mockImplementation(() => {
  return new Promise(() => {});
});

const viasatId = 'vstID';
const testApiUrl = 'test-api-url';

const ViasatIdProvider = ({ children }) => {
  const { setViasatId } = useContext(ApiClientContext);
  useEffect(() => {
    setViasatId(viasatId);
  }, []);

  return children;
};

const wrapper = ({ children }) => (
  <ApiClientProvider apiUrl={testApiUrl}>
    <ViasatIdProvider>{children}</ViasatIdProvider>
  </ApiClientProvider>
);

describe('useGetUser', () => {
  beforeEach(() => {
    getUsers.mockClear();
  });

  it('should instantly start loading the resource', () => {
    const { result } = renderHook(() => useGetUser());
    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
  });

  it('should use the api endpoint provided by the context wrapper', () => {
    const { result } = renderHook(() => useGetUser(), { wrapper });

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
    expect(getUsers.mock.calls[0][0].apiUrl).toEqual(testApiUrl);
  });

  it('should get the viasatId from the provider', () => {
    const { result } = renderHook(() => useGetUser(), { wrapper });
    expect(getUsers.mock.calls[1][1].filter).toContain(viasatId);
  });

  it('should return data after a successful call', async () => {
    getUsers.mockImplementation(() => {
      return Promise.resolve([
        {
          userName: 'userName',
        },
      ]);
    });

    const { result, waitForNextUpdate } = renderHook(() => useGetUser(), {
      wrapper,
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: { userName: 'userName' },
    });
  });

  it('should return error state on failure', async () => {
    const sampleError = 'sample error';
    getUsers.mockImplementation(() => {
      return Promise.reject(sampleError);
    });

    const { result, waitForNextUpdate } = renderHook(() => useGetUser(), {
      wrapper,
    });

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: sampleError,
      loading: false,
      data: null,
    });
  });
});
