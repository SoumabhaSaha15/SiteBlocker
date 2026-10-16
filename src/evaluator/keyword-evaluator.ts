import { ResolvedResult } from "@/types/interfaces";
import { type Keyword } from "@/validator/keywords";

const KeywordsEvaluator = (keys: Keyword[], search: Set<string>) => {
  return (url: URL) => {
    const blockedKeys = new Set(keys);
    const matchFound = !blockedKeys.isDisjointFrom(search);
    const res: ResolvedResult = matchFound
      ? {
          blocked: true,
          reason: "BLOCKED_KEYS",
          matchedPattern: url.hostname,
        }
      : { blocked: false };
    return res;
  };
};
export default KeywordsEvaluator;
