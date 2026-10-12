import z from "zod";
const keywordValidator = z
  .string()
  .regex(/^[a-z]+$/, "Only lowercase letters, no spaces");
export type Keyword = z.infer<typeof keywordValidator>;
export default keywordValidator;
