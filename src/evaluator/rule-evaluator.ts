import { getRuleList } from "@/utils/rules";
import type { RuleEvaluatorFn } from "@/types/interfaces";

const RuleEvaluator = async (search: Set<string>): Promise<RuleEvaluatorFn> => {
  const rules = await getRuleList();

  return (url: URL) => {
    const rule = rules.find((value) => value.site === url.origin);
    if (!rule) return { blocked: false };

    const blockedKeys = new Set(rule.blockedKeys);
    const matchFound = !search.isDisjointFrom(blockedKeys);

    return matchFound === rule.blocked
      ? { blocked: true, reason: 'RULE_RESTRICTED', matchedPattern: url.hostname }
      : { blocked: false };
  };
};

export default RuleEvaluator;
