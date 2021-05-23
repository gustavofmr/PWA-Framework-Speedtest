import { Client } from './client';

describe('Client', () => {
  it('getApiUrl returns url passed to constructor', () => {
    const apiUrl = 'test-api-url';
    const client = new Client({
      apiUrl,
      getAuthorizationHeader: () => {
        return new Headers();
      },
    });

    expect(client.getApiUrl()).toEqual(apiUrl);
  });

  it('getAuthorizationHeader return headers to apply', () => {
    const headers = new Headers({ ExampleHeader: 'test-value' });
    const getAuthorizationHeader = () => headers;
    const client = new Client({
      apiUrl: '',
      getAuthorizationHeader,
    });

    expect(client.getAuthorizationHeader()).toEqual(headers);
  });
});
