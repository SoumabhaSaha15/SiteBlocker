import z from "zod";
const keywordsValidator =  z.string().regex(/^[a-z]+$/, "Only lowercase letters, no spaces");
export type Keywords = z.infer<typeof keywordsValidator>;
export default keywordsValidator;
