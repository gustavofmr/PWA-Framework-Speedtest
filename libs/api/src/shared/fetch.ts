export const httpFetch = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => await (await fetch(input, init)).json();
