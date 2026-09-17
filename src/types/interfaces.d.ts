export type BlockReason = 'DOMAIN_BLACKLIST' | 'RULE' | 'SCHEDULE';

export interface ResolvedResult {
  blocked: boolean;
  reason?: BlockReason;
  matchedPattern?: string;
}

export type BlacklistEvaluatorFn = (url: URL) => ResolvedResult;
export type RuleEvaluatorFn = (url: URL) => ResolvedResult;
