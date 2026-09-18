export type BlockReason = 'DOMAIN_BLACKLISTED' | 'RULE_RESTRICTED' | 'SCHEDULE';

export interface ResolvedResult {
  blocked: boolean;
  reason?: BlockReason;
  matchedPattern?: string;
}

export type BlacklistEvaluatorFn = (url: URL) => ResolvedResult;
export type RuleEvaluatorFn = (url: URL) => ResolvedResult;
