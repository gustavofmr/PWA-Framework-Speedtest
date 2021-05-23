import { renderHook } from '@testing-library/react-hooks';
import faker from 'faker';
import * as React from 'react';
import { ApiClientProvider } from '../../core/context';
import { makeTestOffersData } from '../requests/formatOffer.spec';
import { useGetOffersRaw } from './useGetOffersRaw';

jest.mock('../requests/getOffers.ts');
const { getOffersRaw } = require('../requests/getOffers.ts');
getOffersRaw.mockImplementation(() => {
  return new Promise(() => {});
});

const testApiUrl = 'test-api-url';

const wrapper = ({ children }) => (
  <ApiClientProvider apiUrl={testApiUrl}>{children}</ApiClientProvider>
);

describe('useGetOffersRaw', () => {
  beforeEach(() => {
    getOffersRaw.mockClear();
  });

  const params = {
    location: {
      address: {
        streetAddress: faker.address.streetAddress(),
        locality: faker.address.city(),
        region: faker.address.state(),
        postalCode: faker.address.zipCode(),
        country: 'USA',
      },
      coordinates: {
        latitude: parseFloat(faker.address.latitude()),
        longitude: parseFloat(faker.address.longitude()),
      },
    },
    partyId: faker.random.uuid(),
  };

  it('should instantly start loading the resource', () => {
    const { result } = renderHook(() => useGetOffersRaw(params));

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });
  });

  it('should use the api endpoint provided by the context wrapper', () => {
    const { result } = renderHook(() => useGetOffersRaw(params), {
      wrapper,
    });

    expect(result.current).toEqual({
      error: false,
      loading: true,
      data: null,
    });

    expect(getOffersRaw.mock.calls[0][0].apiUrl).toEqual(testApiUrl);
  });

  it('should use provided params for the api calls', () => {
    const { result } = renderHook(() => useGetOffersRaw(params), {
      wrapper,
    });

    expect(getOffersRaw.mock.calls[0][1]).toBe(params);
  });

  it('should return data after a successful call', async () => {
    const offer = makeTestOffersData();

    getOffersRaw.mockImplementation(() => {
      return Promise.resolve(makeTestOffersData);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetOffersRaw(params),
      {
        wrapper,
      }
    );

    await waitForNextUpdate();

    expect(result.current).toEqual({
      error: false,
      loading: false,
      data: makeTestOffersData,
    });
  });

  it('should return error state on failure', async () => {
    const sampleError = 'sample error';
    getOffersRaw.mockImplementation(() => {
      return Promise.reject(sampleError);
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useGetOffersRaw(params),
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
