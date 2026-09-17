export interface BlockContext {
  url: URL;
  tabId?: number;
  timestamp?: number;
}

export type BlockReason = 'DOMAIN_BLACKLIST' | 'RULE' | 'SCHEDULE';

export interface ResolvedResult {
  blocked: boolean;
  reason?: BlockReason;
  matchedPattern?: string;
}
export interface IBlockResolver {
  name: string;
  resolve(context: BlockContext): ResolvedResult;
}
export interface StaticCreate {
  create(): Promise<IBlockResolver>;
}
