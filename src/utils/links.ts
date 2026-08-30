import z from "zod";
import browser from 'webextension-polyfill';

export const siteParser = z.httpUrl().transform((val: string) => (new URL(val)).origin);
export const sitesValidator = z.array(siteParser).transform(v => [... new Set(v)]);
export type Sites = z.infer<typeof sitesValidator>;
export type Site = z.infer<typeof siteParser>;
const LINK_KEYS = "link-store";

export const getIcon: (hostname: string) => string = (hostname) => `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

export const getLinks: () => Promise<Sites> = async () => {
  const result = (await browser.storage.local.get({ [LINK_KEYS]: [] }));
  return (sitesValidator.parse(result[LINK_KEYS]));
}
export const addLink: (url: Site) => Promise<Sites> = async (url) => {
  const site = siteParser.parse(url, { reportInput: true });
  const result = (await browser.storage.local.get({ [LINK_KEYS]: [] }));
  (result[LINK_KEYS] as Sites).push(site);
  const sites = sitesValidator.parse(result[LINK_KEYS]);
  await browser.storage.local.set({ [LINK_KEYS]: sites });
  return sites;
}
export const setLinks: (url: Sites) => Promise<Sites> = async (urls) => {
  const sites = sitesValidator.parse(urls, { reportInput: true });
  await browser.storage.local.set({ [LINK_KEYS]: sites });
  return sites;
}
