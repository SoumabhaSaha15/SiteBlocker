import browser from "webextension-polyfill";

export const getSyncedData: () => Promise<Record<string, any>> = async () => {
  let keys = await browser.storage.local.getKeys();

  const dataObject: Record<string, any> = {};
  for (const key of keys) {
    const result = await browser.storage.local.get(key);
    dataObject[key] = result[key];
  }
  return dataObject;
}
