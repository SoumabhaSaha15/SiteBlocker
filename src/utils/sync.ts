import { RulesType } from "@/validator/rules";
import browser from "webextension-polyfill";
import { ALLOWED_KEYS, KEYS } from "@/config/storage-keys";
import importableSchema, { Importable } from "@/validator/sync";

export const getSyncedData: () => Promise<Importable> = async () => {
  const result = await browser.storage.local.get(ALLOWED_KEYS);
  return result as Importable;
};

const union = <T>(a: T[] = [], b: T[] = []): T[] => [...new Set([...a, ...b])];

/** Merge rules by `site`; deep-merge the nested `blockedKeys` array. */
const mergeRules = (
  existing: RulesType[] = [],
  incoming: RulesType[] = [],
): RulesType[] => {
  const bySite = new Map<string, RulesType>();

  for (const rule of existing) {
    bySite.set(rule.site, rule);
  }

  for (const rule of incoming) {
    const prev = bySite.get(rule.site);
    bySite.set(
      rule.site,
      prev
        ? {
            ...prev,
            ...rule, // scalar fields (isActive, blocked): imported wins
            blockedKeys: union(prev.blockedKeys, rule.blockedKeys), // never drop keys
          }
        : rule,
    );
  }

  return [...bySite.values()];
};

export const importDataAsJson = async (json: string) => {
  const importableData = importableSchema.parse(json);
  const existingData = await getSyncedData();

  const mergedData: Importable = ALLOWED_KEYS.reduce(
    (data: Importable, key) => {
      switch (key) {
        case KEYS.blockedSites:
          data[key] = union(existingData[key], importableData[key]);
          break;

        case KEYS.keywords:
          data[key] = union<string>(existingData[key], importableData[key]);
          break;

        case KEYS.rules:
          data[key] = mergeRules(existingData[key], importableData[key]);
          break;

        case KEYS.redirectUrl: {
          const value = importableData[key] ?? existingData[key];
          if (value) data[key] = value; // don't write `undefined`
          break;
        }
      }
      return data;
    },
    {},
  );

  await browser.storage.local.set(mergedData);
};

export const downloadJSONFile: (
  filename: string,
  jsonObject: Record<string, unknown>,
) => void = (filename, jsonObject) => {
  const jsonStr = JSON.stringify(jsonObject, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const listenDataChanges = (
  setData: (
    v:
      | Record<string, unknown>
      | ((prev: Record<string, unknown>) => Record<string, unknown>),
  ) => void,
) => {
  const event = (
    _changes: Record<string, browser.Storage.StorageChange>,
    area: string,
  ) => {
    if (area !== "local") return;
    getSyncedData().then(setData);
  };
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
};
