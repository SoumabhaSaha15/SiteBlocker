import { KEYS } from '@/config/storage-keys';
import browser from 'webextension-polyfill';
import { sitesValidator, siteParser, type Sites, type Site } from "@/validator/sites";

const LINK_KEYS = KEYS.blockedSites;
const ICON_SIZE = 64

export const getIcon: (origin: string, size?: number) => string = (origin, size = ICON_SIZE) => `https://www.google.com/s2/favicons?domain=${origin}&sz=${size}`;
// {
//   const url = new URL(browser.runtime.getURL("/_favicon/"));
//   url.searchParams.set("pageUrl", origin);
//   url.searchParams.set("size", String(size));
//   return url.toString();
// }

// export const getFallbackIcon: (origin: string, size?: number) => string = (origin, size = ICON_SIZE) =>

export const getBlockedSites: () => Promise<Sites> = async () => {
  const result = (await browser.storage.local.get({ [LINK_KEYS]: [] }));
  return (result[LINK_KEYS] as Sites);
}

export const isSiteBlocked: (href: Site) => Promise<boolean> = async (href) => {
  const result = (await browser.storage.local.get({ [LINK_KEYS]: [] }));
  return (result[LINK_KEYS] as Sites).includes(href);
}

export const blacklistSite: (url: Site) => Promise<Sites> = async (url) => {
  const site = siteParser.parse(url, { reportInput: true });
  const result = (await browser.storage.local.get({ [LINK_KEYS]: [] }));
  (result[LINK_KEYS] as Sites).push(site);
  const sites = sitesValidator.parse(result[LINK_KEYS]);
  await browser.storage.local.set({ [LINK_KEYS]: sites });
  return sites;
}

export const setBlockedSites: (url: Sites) => Promise<void> = async (urls) => {
  const sites = sitesValidator.parse(urls, { reportInput: true });
  await browser.storage.local.set({ [LINK_KEYS]: sites });
}

export const listenBlockedSitesChanges = (setSites: (v: string[] | ((prev: string[]) => string[])) => void) => {
  const event = (changes: Record<string, browser.Storage.StorageChange>, area: string) => {
    if (area !== "local") return;
    if (changes[LINK_KEYS]) {
      const v = (changes[LINK_KEYS].newValue as Sites) ?? [];
      setSites(v);
    }
  }
  browser.storage.onChanged.addListener(event);
  return () => browser.storage.onChanged.removeListener(event);
}
