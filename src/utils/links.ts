import z from "zod";
import browser from 'webextension-polyfill';

export const siteParser = z.httpUrl().transform((val: string) => (new URL(val)).origin);
export const sitesValidator = z.array(siteParser).transform(v => [... new Set(v)]);
export type Sites = z.infer<typeof sitesValidator>;
export type Site = z.infer<typeof siteParser>;
const LINK_KEYS = "LINK-STORE";
const ICON_SIZE = 64
export const getIcon: (origin: string, sz?: number) => string = (origin, sz = ICON_SIZE) => `https://www.google.com/s2/favicons?domain=${origin}&sz=${sz}`;

export const getBlockedSites: () => Promise<Sites> = async () => {
  const result = (await browser.storage.local.get({ [LINK_KEYS]: [] }));
  return (sitesValidator.parse(result[LINK_KEYS]));
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
export const setBlockedSites: (url: Sites) => Promise<Sites> = async (urls) => {
  const sites = sitesValidator.parse(urls, { reportInput: true });
  await browser.storage.local.set({ [LINK_KEYS]: sites });
  return sites;
}


