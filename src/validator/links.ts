import z from "zod";
export const siteParser = z.httpUrl().transform((val: string) => (new URL(val)).origin);
export const sitesValidator = z.array(siteParser).transform(v => [... new Set(v)]);
export type Sites = z.infer<typeof sitesValidator>;
export type Site = z.infer<typeof siteParser>;
