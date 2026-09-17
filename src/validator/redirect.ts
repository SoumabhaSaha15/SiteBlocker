import z from 'zod';
export const redirectParser = z.httpUrl();
export type Redirect = z.infer<typeof redirectParser>;
