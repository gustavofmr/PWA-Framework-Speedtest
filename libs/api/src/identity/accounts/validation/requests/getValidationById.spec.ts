import faker from 'faker';
import { Client } from '../../../../core/client';
import { getAccountValidationWithValidationId } from './getValidationById';

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

describe('getAccountValidationWithValidationId', () => {
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

  it('should call validations endpoint with id param passed', async () => {
    const randomID = faker.random.uuid();
    await getAccountValidationWithValidationId(client, { id: randomID });
    expect(httpFetch.mock.calls[0][0]).toEqual(
      `${testApiUrl}/accounts/validations/${randomID}`
    );
  });

  it('should pass the result through converter', async () => {
    const randomID = faker.random.uuid();
    const result = await getAccountValidationWithValidationId(client, {
      id: randomID,
    });

    expect(result.status).toEqual(mockedStatus);
    expect(result.validationId).toEqual(mockedValidationId);
  });

  it('should pass Authorization header', async () => {
    const randomID = faker.random.uuid();
    await getAccountValidationWithValidationId(client, {
      id: randomID,
    });
    expect(httpFetch.mock.calls[0][1]).toEqual({ headers: authHeader });
  });
});
