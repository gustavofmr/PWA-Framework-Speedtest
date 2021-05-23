import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { ApiClientProvider } from '../../core/context';
import { makeTestSubscriptionDataObject } from '../requests/formatSubscription';
import { SubscriptionConverter } from '../requests/SubscriptionConverter';
import { useGetSubscriptions } from './useGetSubscriptions';

jest.mock('../requests/getSubscriptions.ts');
const { getSubscriptions } = require('../requests/getSubscriptions.ts');
getSubscriptions.mockImplementation(() => {
  return new Promise(() => {});
});

const testApiUrl = 'test-api-url';
const params = {
  party_id: 'party_id',
};

const wrapper = ({ children }) => (
  <ApiClientProvider apiUrl={testApiUrl}>{children}</ApiClientProvider>
);

describe('useGetSubscriptions', () => {
  beforeEach(() => {
    getSubscriptions.mockClear();
  });

  it('should instantly start loading the resource', () => {
    const { result } = renderHook(() => useGetSubscriptions(params));

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
  });

  it('should use the api endpoint provided by the context wrapper', () => {
    const { result } = renderHook(() => useGetSubscriptions(params), {
      wrapper,
    });

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });

    expect(getSubscriptions.mock.calls[0][0].apiUrl).toEqual(testApiUrl);
  });

  it('should pass additional params to the function', () => {
    renderHook(() => useGetSubscriptions(params), {
      wrapper,
    });

    expect(getSubscriptions.mock.calls[0][1]).toEqual(params);
  });

  it('should return data after a successful call', async () => {
    const subscription = SubscriptionConverter.convert([
      makeTestSubscriptionDataObject(),
    ]);
    getSubscriptions.mockImplementation(() => {
      return Promise.resolve(subscription);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetSubscriptions(params),
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
      () => useGetSubscriptions(params),
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
