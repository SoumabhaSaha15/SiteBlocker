import { z } from "zod";

export const rulesSchema = z.strictObject({
  isActive: z.boolean(),
  site: z.httpUrl().transform((url) => new URL(url).origin),
  blocked: z.boolean(),
  blockedKeys: z
    .array(
      z.string().regex(/^[a-z]+$/, "Only lowercase letters, no spaces")
    )
    .min(1, "Minimum 1 key is required")
});

export const rulesArraySchema = z.array(rulesSchema);
export const purgeArray = rulesArraySchema.transform<RulesType[]>((data) => {
  return [];
});
export type RulesType = z.infer<typeof rulesSchema>;
