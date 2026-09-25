import z from 'zod';
import browser from 'webextension-polyfill';
import { KEYS } from '@/config/storage-keys';

const statusParser = z.boolean().catch(false);
export type WorkingStatus = z.infer<typeof statusParser>;
const STATUS_KEY = KEYS.workingStatus;

export const getWorkingStatus: () => Promise<WorkingStatus> = async () => {
  const result = (await browser.storage.local.get(STATUS_KEY));
  return (statusParser.parse(result[STATUS_KEY]));
}

export const setWorkingStatus: (status: WorkingStatus) => Promise<void> = async (status) => {
  const parsedStatus = statusParser.parse(status);
  await browser.storage.local.set({ [STATUS_KEY]: parsedStatus });
}

export const listenStatusChanges = (setStatus: (v: WorkingStatus | ((prev: WorkingStatus) => WorkingStatus)) => void) => {
  const event = (changes: Record<string, browser.Storage.StorageChange>, area: string) => {
    if (area !== "local") return;
    if (changes[STATUS_KEY]) {
      const v = (changes[STATUS_KEY].newValue as WorkingStatus) ?? false;
      setStatus(v);
    }
  }
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
}
