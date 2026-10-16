export default (params: URLSearchParams) =>
  new Set(
    params
      .values()
      .toArray()
      .map((v) => v.toLocaleLowerCase()),
  );
