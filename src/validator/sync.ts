import z from "zod";
import { KEYS } from "@/config/storage-keys";
import { sitesValidator } from "@/validator/sites";
import { rulesArraySchema } from "@/validator/rules";
import keywordValidator from "@/validator/keywords";
import { redirectParser } from "@/validator/redirect";
const importableSchema = z.codec(
  z.string(),
  z.strictObject({
    [KEYS.blockedSites]: sitesValidator.optional(),
    [KEYS.rules]: rulesArraySchema.optional(),
    [KEYS.keywords]: z.array(keywordValidator).optional(),
    [KEYS.redirectUrl]: redirectParser.optional(),
  }),
  {
    decode: (text, ctx) => {
      try {
        return JSON.parse(text);
      } catch (error) {
        ctx.issues.push({
          code: "custom",
          input: text,
          message: (error as Error).message,
        });
        return z.NEVER;
      }
    },
    encode: (user) => JSON.stringify(user),
  },
);
export default importableSchema;

export type Importable = z.infer<typeof importableSchema>;
