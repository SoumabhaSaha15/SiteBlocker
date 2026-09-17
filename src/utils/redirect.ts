import browser from 'webextension-polyfill';
import { KEYS } from '@/config/storage-keys';
import { redirectParser, type Redirect } from "@/validator/redirect";

const REDIRECT_KEY = KEYS.redirectUrl;

export const deleteRedirect: () => Promise<void> = async () => {
  await browser.storage.local.remove(REDIRECT_KEY);
}

export const getRedirect: () => Promise<Redirect | null> = async () => {
  let result = await browser.storage.local.get(REDIRECT_KEY);
  return (result[REDIRECT_KEY] as Redirect) ?? null;
}
export const setRedirect: (url: Redirect) => Promise<void> = async (url) => {
  const parsedUrl = redirectParser.parse(url);
  await browser.storage.local.set({ [REDIRECT_KEY]: parsedUrl });
}


export const listenRedirectChanges = (setRedirect: (v: Redirect | null | ((prev: Redirect | null) => Redirect | null)) => void) => {
  const event = (changes: Record<string, browser.Storage.StorageChange>, area: string) => {
    if (area !== "local") return;
    if (changes[REDIRECT_KEY]) {
      const v = (changes[REDIRECT_KEY].newValue as Redirect) ?? null;
      setRedirect(v);
    }
  }
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
}
