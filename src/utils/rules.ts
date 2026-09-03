import { z } from "zod";

export const rulesSchema = z.strictObject({
  isActive: z.boolean(),
  site: z.httpUrl().transform<string>((url) => new URL(url).origin),
  blocked: z.boolean(),
  blockedKeys: z.array(z.string().regex(/^[a-z]+$/, "Only lowercase letters, no spaces")).min(1, 'minimum 1 key is required')
});

export type Rules = z.infer<typeof rulesSchema>;
