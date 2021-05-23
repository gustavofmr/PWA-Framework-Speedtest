import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { ApiClientProvider } from '../../../core/context';
import { useGetUsers } from './useGetUsers';

jest.mock('../requests/getUsers.ts');
const { getUsers } = require('../requests/getUsers.ts');
getUsers.mockImplementation(() => {
  return new Promise(() => {});
});

const viasatId = 'vstID';
const testApiUrl = 'test-api-url';
const userQuery = { filter: `accountId eq ${viasatId}` };

const wrapper = ({ children }) => (
  <ApiClientProvider apiUrl={testApiUrl}>{children}</ApiClientProvider>
);

describe('useGetUsers', () => {
  beforeEach(() => {
    getUsers.mockClear();
  });

  it('should instantly start loading the resource', () => {
    const { result } = renderHook(() => useGetUsers(userQuery));
    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
  });

  it('should use the api endpoint provided by the context wrapper', () => {
    const { result } = renderHook(() => useGetUsers(userQuery), { wrapper });

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });

    expect(getUsers.mock.calls[0][0].apiUrl).toEqual(testApiUrl);
  });

  it('should have the params we pass to the function', () => {
    const { result } = renderHook(() => useGetUsers(userQuery), { wrapper });
    expect(getUsers.mock.calls[0][1]).toEqual(userQuery);
  });

  it('should return data after a successful call', async () => {
    const userDataArray = [{ userName: 'user1' }, { userName: 'user2' }];
    getUsers.mockImplementation(() => {
      return Promise.resolve(userDataArray);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetUsers(userQuery),
      {
        wrapper,
      }
    );

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: userDataArray,
    });
  });

  it('should return error state on failure', async () => {
    const sampleError = 'sample error';
    getUsers.mockImplementation(() => {
      return Promise.reject(sampleError);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetUsers(userQuery),
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
