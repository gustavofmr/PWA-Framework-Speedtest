import { generateUrl } from './utils';

describe('generateUrl', () => {
  it('should not do anything to url with empty param list', () => {
    expect(generateUrl('/test', {})).toEqual('/test');
  });

  it('should add any parameters that could not be mapped as query params', () => {
    expect(generateUrl('/test', { a: '1', b: 2, c: true })).toEqual(
      '/test?a=1&b=2&c=true'
    );
  });

  it('should replace params in url if matches', () => {
    expect(
      generateUrl('/test/{a}/{e}/{d}', { a: '1', b: 2, c: true, e: 6 })
    ).toEqual('/test/1/6/{d}?b=2&c=true');
  });

  it('should encode params in url', () => {
    expect(
      generateUrl('/test/{a}/', { a: 'string with space', b: ':' })
    ).toEqual('/test/string%20with%20space/?b=%3A');
  });
});
