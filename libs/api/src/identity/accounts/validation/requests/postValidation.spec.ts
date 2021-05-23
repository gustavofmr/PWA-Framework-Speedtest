import faker from 'faker';
import { Client } from '../../../../core/client';
import { postAccountValidation } from './postValidation';

jest.mock('../../../../shared/fetch.ts');
const { httpFetch } = require('../../../../shared/fetch');

const mockedStatus = faker.random.boolean();
const mockedValidationId = faker.random.uuid();

httpFetch.mockImplementation(() => {
  return Promise.resolve({
    status: mockedStatus.toString(),
    id: mockedValidationId,
  });
});

let authHeader;
let client;
const testApiUrl = 'test-api-url';
const validationPostBody = {
  accountId: mockedValidationId,
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

describe('postAccountValidation', () => {
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
    await postAccountValidation(client, validationPostBody);
    expect(httpFetch.mock.calls[0][0]).toEqual(
      `${testApiUrl}/accounts/validations`
    );
  });

  it('should pass the body to the endpoint', async () => {
    await postAccountValidation(client, validationPostBody);
    const mockedFetchedBody = httpFetch.mock.calls[0][1].body;
    expect(mockedFetchedBody).toEqual(JSON.stringify(validationPostBody));
  });

  it('should pass the result through converter', async () => {
    const result = await postAccountValidation(client, validationPostBody);

    expect(result.status).toEqual(mockedStatus);
    expect(result.validationId).toEqual(mockedValidationId);
  });

  it.only('should pass Authorization header and prepare the headers for post', async () => {
    await postAccountValidation(client, validationPostBody);
    const mockedFetchHeaders = httpFetch.mock.calls[0][1]['headers'];
    const mockedFetchMethod = httpFetch.mock.calls[0][1]['method'];

    expect(mockedFetchHeaders).toEqual({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    expect(mockedFetchMethod).toEqual('POST');
  });
});
