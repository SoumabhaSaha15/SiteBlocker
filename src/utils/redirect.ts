import z from 'zod';
import { KEYS } from '@/keys';
import browser from 'webextension-polyfill';
import { isSiteBlocked } from "@/utils/sites";

const redirectParser = z.httpUrl();
export type Redirect = z.infer<typeof redirectParser>;
const REDIRECT_KEY = KEYS.redirectUrl;

export const tryRedirect: () => Promise<Redirect> = async () => {
  const result = (await browser.storage.local.get(REDIRECT_KEY));
  const redirectLink = redirectParser.parse(result[REDIRECT_KEY], { reportInput: true });
  if (await isSiteBlocked(URL.parse(redirectLink)!.origin)) throw new Error("Redirect URL is blocked!");
  return redirectLink;
}

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
