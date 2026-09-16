import { KEYS } from "@/config/storage-keys";
import browser from "webextension-polyfill";
import { type RulesType, rulesSchema, rulesArraySchema } from "@/validator/rules";

const RULES_KEY = KEYS.rules;

export const fetchRuleList: () => Promise<RulesType[]> = async () => {
  const result = (await browser.storage.local.get({ [RULES_KEY]: [] }));
  return (result[RULES_KEY] as RulesType[]);
}

export const saveRule: (rule: RulesType) => Promise<void> = async (rule) => {
  const parsedRule = rulesSchema.parse(rule);
  const result = (await browser.storage.local.get({ [RULES_KEY]: [] }));
  const newRules = rulesArraySchema.parse((result[RULES_KEY] as RulesType[]));
  let found = false;
  for (let index = 0; index < newRules.length; index++) {
    if (newRules[index].site === rule.site) {
      found = true;
      newRules[index] = parsedRule;
      break;
    }
  }
  if (!found) newRules.push(parsedRule);
  await browser.storage.local.set({ [RULES_KEY]: newRules });
}

export const listenRulesChanges = (setRules: (v: RulesType[] | ((prev: RulesType[]) => RulesType[])) => void) => {
  const event = (changes: Record<string, browser.Storage.StorageChange>, area: string) => {
    if (area !== "local") return;
    if (changes[RULES_KEY]) {
      const v = (changes[RULES_KEY].newValue as RulesType[]) ?? [];
      setRules(v);
    }
  }
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
}
