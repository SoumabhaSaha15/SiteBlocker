import { ALLOWED_KEYS } from "@/config/storage-keys";
import browser from "webextension-polyfill";

export const getSyncedData: () => Promise<Record<string, unknown>> = async () => {
  const result = await browser.storage.local.get(ALLOWED_KEYS);
  return result as Record<string, unknown>;
}

export const downloadJSONFile: (filename: string, jsonObject: Record<string, unknown>) => void = (filename, jsonObject) => {
  const jsonStr = JSON.stringify(jsonObject, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const listenDataChanges = (setData: (v: Record<string, unknown> | ((prev: Record<string, unknown>) => Record<string, unknown>)) => void) => {
  const event = (_changes: Record<string, browser.Storage.StorageChange>, area: string) => {
    if (area !== "local") return;
    getSyncedData().then(setData);
  }
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
}
