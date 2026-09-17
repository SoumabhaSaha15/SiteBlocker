import createKeywordSet from "@/helper/search-set";
import RuleEvaluator from "@/evaluator/rule-evaluator";
import BlacklistEvaluator from "@/evaluator/blacklist-evaluator";
import type { ResolvedResult } from "@/types/interfaces";

const ResolveSite = async (url: string): Promise<ResolvedResult> => {
  const requestedUrl = new URL(url);
  const blacklistCheck = await BlacklistEvaluator();
  const blacklistResult = blacklistCheck(requestedUrl);
  if (blacklistResult.blocked) return blacklistResult;
  const search = createKeywordSet(requestedUrl.searchParams);
  const ruleCheck = await RuleEvaluator(search);
  const ruleResult = ruleCheck(requestedUrl);
  if (ruleResult.blocked) return ruleResult;
  return { blocked: false };
};

export default ResolveSite;
