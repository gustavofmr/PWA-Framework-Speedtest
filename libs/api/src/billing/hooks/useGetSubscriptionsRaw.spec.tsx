import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { ApiClientProvider } from '../../core/context';
import { makeTestSubscriptionDataObject } from '../requests/formatSubscription';
import { useGetSubscriptionsRaw } from './useGetSubscriptionsRaw';

jest.mock('../requests/getSubscriptions.ts');
const { getSubscriptionsRaw } = require('../requests/getSubscriptions.ts');
getSubscriptionsRaw.mockImplementation(() => {
  return new Promise(() => {});
});

const testApiUrl = 'test-api-url';

const wrapper = ({ children }) => (
  <ApiClientProvider apiUrl={testApiUrl}>{children}</ApiClientProvider>
);

describe('useGetSubscriptionsRaw', () => {
  beforeEach(() => {
    getSubscriptionsRaw.mockClear();
  });

  it('should instantly start loading the resource', () => {
    const { result } = renderHook(() => useGetSubscriptionsRaw());

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
  });

  it('should use the api endpoint provided by the context wrapper', () => {
    const { result } = renderHook(() => useGetSubscriptionsRaw(), {
      wrapper,
    });

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });

    expect(getSubscriptionsRaw.mock.calls[0][0].apiUrl).toEqual(testApiUrl);
  });

  it('should have no additional params passed to the function', () => {
    const { result } = renderHook(() => useGetSubscriptionsRaw(), {
      wrapper,
    });

    expect(getSubscriptionsRaw.mock.calls[0][1]).toEqual(undefined);
  });

  it('should return data after a successful call', async () => {
    const subscription = makeTestSubscriptionDataObject();
    getSubscriptionsRaw.mockImplementation(() => {
      return Promise.resolve([subscription]);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetSubscriptionsRaw(),
      {
        wrapper,
      }
    );

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: [subscription],
    });
  });

  it('should return error state on failure', async () => {
    const sampleError = 'sample error';
    getSubscriptionsRaw.mockImplementation(() => {
      return Promise.reject(sampleError);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetSubscriptionsRaw(),
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
