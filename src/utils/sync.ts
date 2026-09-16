import { RESTRICTED_KEYS } from "@/config/storage-keys";
import browser from "webextension-polyfill";

export const getSyncedData: () => Promise<Record<string, any>> = async () => {
  const keys = (await browser.storage.local.getKeys()).filter(item => !RESTRICTED_KEYS.includes(item));
  const result = await browser.storage.local.get(keys);
  return result as Record<string, any>;
}

export const downloadJSONFile: (filename: string, jsonObject: Record<string, any>) => void = (filename, jsonObject) => {
  const jsonStr = JSON.stringify(jsonObject, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const listenDataChanges = (setData: (v: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void) => {
  const event = (changes: Record<string, browser.Storage.StorageChange>, area: string) => {
    if (area !== "local") return;
    getSyncedData().then(setData);
  }
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
}
