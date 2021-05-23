import { httpFetch } from './fetch';

describe('httpFetch', () => {
  it('should pass all params to fetch and decode response json', async () => {
    const json = { someValue: 'test' };
    const url = '/test-url';
    const params = { method: 'POST ' };

    // store original function to restore on test end
    const origialFetch = (global as any).fetch;

    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(json),
      })
    );

    const response = await httpFetch(url, params);
    expect(response).toEqual(json);
    expect(fetch).toHaveBeenCalledWith(url, params);

    // restore global fetch
    (global as any).fetch = origialFetch;
  });
});
