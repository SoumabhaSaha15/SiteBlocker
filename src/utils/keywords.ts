import browser from "webextension-polyfill";
import { KEYS } from "@/config/storage-keys";
import keywordsValidator, { type Keyword } from "@/validator/keywords";

const KEYWORDS_KEY = KEYS.keywords;

export const getRestrictedKeywords = async () => {
  const res = await browser.storage.local.get({ [KEYWORDS_KEY]: [] });
  return res[KEYWORDS_KEY] as Keyword[];
};
export const addRestrictedKeywords = async (kw: string) => {
  keywordsValidator.parse(kw);
  const res = await browser.storage.local.get({ [KEYWORDS_KEY]: [] });
  (res[KEYWORDS_KEY] as Keyword[]).push(kw);
  await browser.storage.local.set({ [KEYWORDS_KEY]: res[KEYWORDS_KEY] });
};

export const listenBlockedKeywordChanges = (
  setKeywords: (v: string[] | ((prev: string[]) => string[])) => void,
) => {
  const event = (
    changes: Record<string, browser.Storage.StorageChange>,
    area: string,
  ) => {
    if (area !== "local") return;
    if (changes[KEYWORDS_KEY]) {
      const v = (changes[KEYWORDS_KEY].newValue as Keyword[]) ?? [];
      setKeywords(v);
    }
  };
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
};
