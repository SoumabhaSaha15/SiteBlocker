import z from "zod";
import browser from 'webextension-polyfill';

const sitesValidator = z.array(z.url()).catch([]);
const LINK_KEYS = "link-store";

export const getIcon: (hostname: string) => string = (hostname) => `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

export const getLinks: () => Promise<string[]> = async () => {
  const result = (await browser.storage.local.get(LINK_KEYS));
  return (sitesValidator.parse(result[LINK_KEYS]));
}

export const setLinks: (url: string[]) => Promise<void> = async (url: string[]) => {
  await browser.storage.local.set({ [LINK_KEYS]: url });
}
