export function generateUrl(
  url: string,
  params: Record<string, string | string[] | boolean | number | undefined>
): string {
  let path = url;

  const filteredParams = Object.entries(params).filter(
    ([_, value]) => value !== undefined
  ) as [string, string | boolean | number][];
  const queryParams: [string, string | boolean | number][] = [];
  filteredParams.forEach(([key, value]) => {
    const isQueryParam = !path.includes(`{${key}}`);
    if (isQueryParam) {
      queryParams.push([key, value]);
    } else {
      path = path.replace(`{${key}}`, `${encodeURIComponent(value)}`);
    }
  });

  const urlQueryParams = new URLSearchParams();
  queryParams.forEach(([key, value]) => {
    urlQueryParams.append(key, `${value}`);
  });

  return urlQueryParams.toString()
    ? `${path}?${urlQueryParams.toString()}`
    : path;
}
