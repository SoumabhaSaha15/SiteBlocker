export type BlockReason =
  "DOMAIN_BLACKLISTED" | "RULE_RESTRICTED" | "SCHEDULE" | "BLOCKED_KEYS";

export interface ResolvedResult {
  blocked: boolean;
  reason?: BlockReason;
  matchedPattern?: string;
}

export type BlacklistEvaluatorFn = (url: URL) => ResolvedResult;
export type RuleEvaluatorFn = (url: URL) => ResolvedResult;
