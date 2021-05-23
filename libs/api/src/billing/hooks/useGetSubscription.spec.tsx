import { renderHook } from '@testing-library/react-hooks';
import React, { useContext, useEffect } from 'react';
import { ApiClientContext, ApiClientProvider } from '../../core/context';
import { makeTestSubscriptionDataObject } from '../requests/formatSubscription';
import { SubscriptionConverter } from '../requests/SubscriptionConverter';
import { useGetSubscription } from './useGetSubscription';

jest.mock('../requests/getSubscriptions.ts');
const { getSubscriptions } = require('../requests/getSubscriptions.ts');
getSubscriptions.mockImplementation(() => {
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

describe('useGetSubscription', () => {
  beforeEach(() => {
    getSubscriptions.mockClear();
  });

  const params = { party_id: viasatId };

  it('should instantly start loading the resource', () => {
    const { result } = renderHook(() => useGetSubscription(params));

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
  });

  it('should use the api endpoint provided by the context wrapper', () => {
    const { result } = renderHook(() => useGetSubscription(params), {
      wrapper,
    });

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });

    expect(getSubscriptions.mock.calls[0][0].apiUrl).toEqual(testApiUrl);
  });

  it('should get the viasatId from the provider', () => {
    renderHook(() => useGetSubscription(params), {
      wrapper,
    });

    expect(getSubscriptions.mock.calls[0][1]).toBe(params);
  });

  it('should return data after a successful call', async () => {
    const subscription = SubscriptionConverter.convert([
      makeTestSubscriptionDataObject(),
    ]);

    getSubscriptions.mockImplementation(() => {
      return Promise.resolve(subscription);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetSubscription(params),
      {
        wrapper,
      }
    );

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: subscription,
    });
  });

  it('should return error state on failure', async () => {
    const sampleError = 'sample error';
    getSubscriptions.mockImplementation(() => {
      return Promise.reject(sampleError);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetSubscription(params),
      {
        wrapper,
      }
    );

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: sampleError,
      loading: false,
      data: null,
    });
  });
});
