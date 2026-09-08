import browser from "webextension-polyfill";
import { type RulesType, rulesSchema, rulesArraySchema } from "@/validator/rules";

const RULES_KEY = "RULES-STORE";

export const fetchRuleList: () => Promise<RulesType[]> = async () => {
  const result = (await browser.storage.local.get({ [RULES_KEY]: [] }));
  return (result[RULES_KEY] as RulesType[]);
}

export const saveRule: (rule: RulesType) => Promise<RulesType[]> = async (rule) => {
  const result = (await browser.storage.local.get({ [RULES_KEY]: [] }));
  if ((result[RULES_KEY] as RulesType[]).length === 0) {
    await browser.storage.local.set({ [RULES_KEY]: [rule] });
    console.log([rule]);
    return [rule];
  }
  const newRules = (result[RULES_KEY] as RulesType[]).map((value) => {
    if (value.site === rule.site) {
      value.blockedKeys.push(...rule.blockedKeys);
      value.blockedKeys = (new Set<string>(value.blockedKeys)).values().toArray();
      value.blocked = rule.blocked;
      value.isActive = rule.isActive;
    }
    return value;
  });
  await browser.storage.local.set({ [RULES_KEY]: newRules });
  console.log(newRules);
  return newRules;
}
