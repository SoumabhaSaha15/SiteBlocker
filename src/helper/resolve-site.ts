import browser from "webextension-polyfill";
import { KEYS } from "@/config/storage-keys";
import { type Sites } from "@/validator/sites";
import createKeywordSet from "@/helper/search-set";
import { type RulesType } from "@/validator/rules";
import RuleEvaluator from "@/evaluator/rule-evaluator";
import type { ResolvedResult } from "@/types/interfaces";
import KeywordsEvaluator from "@/evaluator/keyword-evaluator";
import BlacklistEvaluator from "@/evaluator/blacklist-evaluator";
import { Keyword } from "@/validator/keywords";

const ResolveSite = async (url: string): Promise<ResolvedResult> => {
  const requestedUrl = new URL(url);
  const result = await browser.storage.local.get({
    [KEYS.rules]: [],
    [KEYS.keywords]: [],
    [KEYS.blockedSites]: [],
  });
  const blacklistCheck = BlacklistEvaluator(
    new Set(result[KEYS.blockedSites] as Sites),
  );
  const blacklistResult = blacklistCheck(requestedUrl);
  if (blacklistResult.blocked) return blacklistResult;
  const search = createKeywordSet(requestedUrl.searchParams);
  const keywordCheck = KeywordsEvaluator(
    result[KEYS.keywords] as Keyword[],
    search,
  );
  const keywordResult = keywordCheck(requestedUrl);
  if (keywordResult.blocked) return keywordResult;
  const ruleCheck = RuleEvaluator(result[KEYS.rules] as RulesType[], search);
  const ruleResult = ruleCheck(requestedUrl);
  if (ruleResult.blocked) return ruleResult;
  return { blocked: false };
};

export default ResolveSite;
