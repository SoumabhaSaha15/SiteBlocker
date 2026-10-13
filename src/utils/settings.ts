import z from "zod";
import browser from "webextension-polyfill";
import { KEYS } from "@/config/storage-keys";

const statusParser = z.boolean().catch(false);
export type ContextMenuStatus = z.infer<typeof statusParser>;

export const getContextMenuStatus: () => Promise<ContextMenuStatus> =
  async () => {
    const result = await browser.storage.local.get(KEYS.contextMenuShortcut);
    return statusParser.parse(result[KEYS.contextMenuShortcut]);
  };

export const setContextMenuStatus: (
  status: ContextMenuStatus,
) => Promise<void> = async (status) => {
  const parsedStatus = statusParser.parse(status);
  await browser.storage.local.set({ [KEYS.contextMenuShortcut]: parsedStatus });
};

export const listenContextMenuStatusChanges = (
  setStatus: (
    v: ContextMenuStatus | ((prev: ContextMenuStatus) => ContextMenuStatus),
  ) => void,
) => {
  const event = (
    changes: Record<string, browser.Storage.StorageChange>,
    area: string,
  ) => {
    if (area !== "local") return;
    if (changes[KEYS.contextMenuShortcut]) {
      const v = !!changes[KEYS.contextMenuShortcut].newValue;
      setStatus(v);
    }
  };
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
};
