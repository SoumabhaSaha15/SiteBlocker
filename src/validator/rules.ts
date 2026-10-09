import { z } from "zod";
import keywordsValidator from "@/validator/keys";
export const rulesSchema = z.strictObject({
  isActive: z.boolean(),
  site: z.httpUrl().transform((url) => new URL(url).origin),
  blocked: z.boolean(),
  blockedKeys: z.array(keywordsValidator).min(1, "Minimum 1 key is required")
});

export const rulesArraySchema = z.array(rulesSchema);

export type RulesType = z.infer<typeof rulesSchema>;
