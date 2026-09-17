import { getBlockedSites } from "@/utils/sites";
import type { Sites, Site } from "@/validator/sites";
import { IBlockResolver, BlockContext, type ResolvedResult, StaticCreate } from "@/types/interfaces";
class BlacklistResolver implements IBlockResolver {
  name = 'BlacklistResolver';
  #blacklist: Set<Site>;
  private constructor(blacklist: Sites) {
    this.#blacklist = new Set(blacklist);
  }
  static async create(): Promise<BlacklistResolver> {
    const list = await getBlockedSites();
    return new BlacklistResolver(list);
  }
  resolve({ url }: BlockContext): ResolvedResult {
    const isBlacklisted = this.#blacklist.has(url.origin);
    return isBlacklisted
      ? { blocked: true, reason: 'DOMAIN_BLACKLIST', matchedPattern: url.hostname }
      : { blocked: false };
  }

}
BlacklistResolver satisfies StaticCreate;
export default BlacklistResolver
