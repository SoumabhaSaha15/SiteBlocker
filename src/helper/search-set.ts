export default (params: URLSearchParams) => new Set(params.values().map(v => v.toLocaleLowerCase()))
