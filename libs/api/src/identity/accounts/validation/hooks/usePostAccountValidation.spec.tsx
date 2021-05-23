import faker from 'faker';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { ApiClientProvider } from '../../../../core/context';
import { usePostAccountValidation } from './usePostAccountValidation';

jest.mock('../requests/postValidation');
const { postAccountValidation } = require('../requests/postValidation');
postAccountValidation.mockImplementation(() => {
  return new Promise(() => {});
});

const testApiUrl = 'test-api-url';
const validationPostBody = {
  accountId: faker.random.uuid(),
  emails: [
    {
      value: faker.internet.email(),
    },
  ],
  phoneNumbers: [
    {
      value: faker.phone.phoneNumber(),
    },
  ],
};

const validationData = {
  status: faker.random.boolean(),
  validationId: faker.random.uuid(),
};

const wrapper = ({ children }) => (
  <ApiClientProvider apiUrl={testApiUrl}>{children}</ApiClientProvider>
);

describe('usePostAccountValidation', () => {
  beforeEach(() => {
    postAccountValidation.mockClear();
  });

  it('should instantly start loading the resource ', () => {
    const { result } = renderHook(() =>
      usePostAccountValidation(validationPostBody)
    );
    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
  });

  it('should use the api endpoint provided by the context wrapper', () => {
    const { result } = renderHook(
      () => usePostAccountValidation(validationPostBody),
      { wrapper }
    );

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });

    expect(postAccountValidation.mock.calls[0][0].apiUrl).toEqual(testApiUrl);
  });

  it('should have the body we pass to the function', () => {
    const { result } = renderHook(
      () => usePostAccountValidation(validationPostBody),
      { wrapper }
    );

    expect(postAccountValidation.mock.calls[0][1]).toEqual(validationPostBody);
  });

  it('should return data after a successful call', async () => {
    postAccountValidation.mockImplementation(() => {
      return Promise.resolve(validationData);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => usePostAccountValidation(validationPostBody),
      {
        wrapper,
      }
    );

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: validationData,
    });
  });

  it('should return error state on failure', async () => {
    const sampleError = 'sample error';
    postAccountValidation.mockImplementation(() => {
      return Promise.reject(sampleError);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => usePostAccountValidation(validationPostBody),
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
