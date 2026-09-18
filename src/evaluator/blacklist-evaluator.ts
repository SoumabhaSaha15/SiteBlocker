import { getBlockedSites } from "@/utils/sites";
import type { BlacklistEvaluatorFn } from "@/types/interfaces";

const BlacklistEvaluator = async (): Promise<BlacklistEvaluatorFn> => {
  const sites = await getBlockedSites();
  const blacklist = new Set(sites);

  return (url: URL) => {
    const isBlacklisted = blacklist.has(url.origin);
    return isBlacklisted
      ? { blocked: true, reason: 'DOMAIN_BLACKLISTED', matchedPattern: url.hostname }
      : { blocked: false };
  };
};

export default BlacklistEvaluator;
