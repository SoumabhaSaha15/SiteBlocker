import RuleEvaluator from "@/resolver/rule-resolver";
import { type ResolvedResult } from "@/types/interfaces";
import BlacklistEvaluator from "@/resolver/blacklist-resolver";

const ResolveSite: (url: string) => Promise<ResolvedResult> = async (url: string) => {
  const requested_url = new URL(url);
  const blacklistEvaluator = await BlacklistEvaluator.create();
  let result: ResolvedResult = blacklistEvaluator.resolve({ url: requested_url });
  if (result.blocked) return result;
  const ruleEvaluator = await RuleEvaluator.create();
  result = ruleEvaluator.resolve({ url: requested_url });
  if (result.blocked) return result;
  return result;
}

export default ResolveSite;
