import faker from 'faker';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { ApiClientProvider } from '../../../../core/context';
import { useGetAccountValidationByValidationId } from './useGetAccountValidationById';

jest.mock('../requests/getValidationById');
const {
  getAccountValidationWithValidationId,
} = require('../requests/getValidationById');
getAccountValidationWithValidationId.mockImplementation(() => {
  return new Promise(() => {});
});

const testApiUrl = 'test-api-url';
const validationQuery = { id: faker.random.uuid() };
const validationData = {
  status: faker.random.boolean(),
  validationId: faker.random.uuid(),
};

const wrapper = ({ children }) => (
  <ApiClientProvider apiUrl={testApiUrl}>{children}</ApiClientProvider>
);

describe('useGetAccountValidationByValidationId', () => {
  beforeEach(() => {
    getAccountValidationWithValidationId.mockClear();
  });

  it('should instantly start loading the resource ', () => {
    const { result } = renderHook(() =>
      useGetAccountValidationByValidationId(validationQuery)
    );
    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
  });

  it('should use the api endpoint provided by the context wrapper', () => {
    const { result } = renderHook(
      () => useGetAccountValidationByValidationId(validationQuery),
      { wrapper }
    );

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });

    expect(
      getAccountValidationWithValidationId.mock.calls[0][0].apiUrl
    ).toEqual(testApiUrl);
  });

  it('should have the params we pass to the function', () => {
    const { result } = renderHook(
      () => useGetAccountValidationByValidationId(validationQuery),
      { wrapper }
    );

    expect(getAccountValidationWithValidationId.mock.calls[0][1]).toEqual(
      validationQuery
    );
  });

  it('should return data after a successful call', async () => {
    getAccountValidationWithValidationId.mockImplementation(() => {
      return Promise.resolve(validationData);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetAccountValidationByValidationId(validationQuery),
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
    getAccountValidationWithValidationId.mockImplementation(() => {
      return Promise.reject(sampleError);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetAccountValidationByValidationId(validationQuery),
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
