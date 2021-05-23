import faker from 'faker';
import { Client } from '../../../core/client';
import { getUsers, getUsersRaw } from './getUsers';
import { makeTestUserData } from './UserConverter.spec';

jest.mock('../../../shared/fetch.ts');
const { httpFetch } = require('../../../shared/fetch');

httpFetch.mockImplementation(() => {
  return Promise.resolve({ ...makeTestUserData() });
});

let authHeader;
let client;
const testApiUrl = 'test-api-url';

describe('getUsersRaw', () => {
  beforeEach(() => {
    authHeader = new Headers({
      Authorization: 'Bearer tok',
    });

    client = new Client({
      apiUrl: testApiUrl,
      getAuthorizationHeader() {
        return authHeader;
      },
    });

    httpFetch.mockClear();
  });

  it('should call validations endpoint', async () => {
    await getUsersRaw(client, {});
    expect(httpFetch.mock.calls[0][0]).toEqual(`${testApiUrl}/identity/users`);
  });

  it('should not pass the result through converter', async () => {
    const result = await getUsersRaw(client, {
      filter: `accountId eq 123`,
    });

    // if it was converted we would not have these felids
    expect(result[0].schemas).toBeTruthy();
    expect(result[0].externalId).toBeTruthy();
    expect(result[0].userName).toBeTruthy();
    expect(result[0].entitlements).toBeTruthy();
    expect(result[0].name).toBeTruthy();
    expect(result[0].phoneNumbers).toBeTruthy();
    expect(result[0].addresses).toBeTruthy();
    expect(result[0].emails).toBeTruthy();
  });

  it('should pass Authorization header', async () => {
    await getUsersRaw(client, {
      filter: `accountId eq 123`,
    });
    expect(httpFetch.mock.calls[0][1]).toEqual({ headers: authHeader });
  });

  describe('getUserRaw Query Params', () => {
    it('should handle the filer param being passed to it ', async () => {
      let filterQuery = 'accountId eq 123';
      await getUsersRaw(client, {
        filter: filterQuery,
      });

      filterQuery = filterQuery.split(' ').join('+');
      expect(httpFetch.mock.calls[0][0]).toEqual(
        `${testApiUrl}/identity/users?filter=${filterQuery}`
      );
    });

    it('should handle the sortBy param being passed to it ', async () => {
      let filterQuery = 'sortBySomething';
      await getUsersRaw(client, {
        sortBy: filterQuery,
      });

      filterQuery = filterQuery.split(' ').join('+');
      expect(httpFetch.mock.calls[0][0]).toEqual(
        `${testApiUrl}/identity/users?sortBy=${filterQuery}`
      );
    });

    it('should handle the sortOrder param being passed to it ', async () => {
      let filterQuery = 'ascending' as const;
      await getUsersRaw(client, {
        sortOrder: filterQuery,
      });

      expect(httpFetch.mock.calls[0][0]).toEqual(
        `${testApiUrl}/identity/users?sortOrder=${filterQuery}`
      );
    });

    it('should handle the startIndex param being passed to it ', async () => {
      let filterQuery = 1;
      await getUsersRaw(client, {
        startIndex: filterQuery,
      });

      expect(httpFetch.mock.calls[0][0]).toEqual(
        `${testApiUrl}/identity/users?startIndex=${filterQuery}`
      );
    });

    it('should handle the count param being passed to it ', async () => {
      let filterQuery = 1;
      await getUsersRaw(client, {
        count: filterQuery,
      });

      expect(httpFetch.mock.calls[0][0]).toEqual(
        `${testApiUrl}/identity/users?count=${filterQuery}`
      );
    });

    it('should handle the attributes param being passed to it ', async () => {
      let filterQuery = ['userName', 'id'];
      await getUsersRaw(client, {
        attributes: filterQuery,
      });

      const stringFilterQuery = filterQuery.reduce(
        (previousValue, currentValue) => {
          return `${previousValue}%2C${currentValue}`;
        }
      );

      expect(httpFetch.mock.calls[0][0]).toEqual(
        `${testApiUrl}/identity/users?attributes=${stringFilterQuery}`
      );
    });

    it('should handle the excludedAttributes param being passed to it ', async () => {
      let filterQuery = ['userName', 'id'];
      await getUsersRaw(client, {
        excludedAttributes: filterQuery,
      });

      const stringFilterQuery = filterQuery.reduce(
        (previousValue, currentValue) => {
          return `${previousValue}%2C${currentValue}`;
        }
      );

      expect(httpFetch.mock.calls[0][0]).toEqual(
        `${testApiUrl}/identity/users?excludedAttributes=${stringFilterQuery}`
      );
    });
  });

  describe('getUsers', () => {
    it('should convert data to type user ', async () => {
      const result = await getUsers(client, {
        filter: `accountId eq 123`,
      });

      expect(result[0].accountId).toBeTruthy();
      expect(result[0].city).toBeTruthy();
      expect(result[0].country).toBeTruthy();
      expect(result[0].email).toBeTruthy();
      expect(result[0].firstName).toBeTruthy();
      expect(result[0].lastName).toBeTruthy();
      expect(result[0].partyId).toBeTruthy();
      expect(result[0].phoneNumber).toBeTruthy();
      expect(result[0].street).toBeTruthy();
    });
  });
});
