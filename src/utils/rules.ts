import browser from "webextension-polyfill";
import { type RulesType, rulesSchema, rulesArraySchema } from "@/validator/rules";

const RULES_KEY = "RULES-STORE";

export const fetchRuleList: () => Promise<RulesType[]> = async () => {
  const result = (await browser.storage.local.get({ [RULES_KEY]: [] }));
  return (result[RULES_KEY] as RulesType[]);
}

export const saveRule: (rule: RulesType) => Promise<RulesType[]> = async (rule) => {
  const parsedRule = rulesSchema.parse(rule);
  const result = (await browser.storage.local.get({ [RULES_KEY]: [] }));
  const newRules = rulesArraySchema.parse((result[RULES_KEY] as RulesType[]));
  let found = false;
  for (let index = 0; index < newRules.length; index++) {
    if (newRules[index].site === rule.site) {
      found = true;
      parsedRule.blockedKeys = [...new Set<string>(newRules[index].blockedKeys.concat(parsedRule.blockedKeys))];
      newRules[index] = parsedRule;
      break;
    }
  }
  if (!found) newRules.push(parsedRule);
  await browser.storage.local.set({ [RULES_KEY]: newRules });
  return newRules;
}
