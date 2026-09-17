import browser from "webextension-polyfill";
import { blacklistSite } from "@/utils/sites"
import ResolveSite from "@/helper/resolve-site";
import { getRedirect } from "@/utils/redirect";
import { getWorkingStatus } from "@/utils/blocker";
import type { ResolvedResult } from "@/types/interfaces";


browser.runtime.onInstalled.addListener(console.dir);

browser.action.onClicked.addListener(() => {
  browser.tabs.create({
    url: browser.runtime.getURL("src/index.html"),
  });
});


browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && tab.url) {
    const extensionUrlPrefix = browser.runtime.getURL("");
    if (tab.url.startsWith(extensionUrlPrefix)) return; // Prevent recursive redirect loops on internal extension pages
    const isRunning = await getWorkingStatus();
    if (!isRunning) return;
    let result: ResolvedResult = await ResolveSite(tab.url);
    if (!result.blocked) return;
    const defaultGuard = browser.runtime.getURL(
      `src/redirect.html?blockedUrl=${encodeURIComponent(tab.url)}`
    );
    const redirect = await getRedirect();
    let target = defaultGuard;
    if (redirect) {
      result = await ResolveSite(redirect);
      if (!result.blocked) target = redirect;
    }
    await browser.tabs.update(tabId, { url: target });
    return;
  }
});

const CTX_MENU_ID = "webdude-site_blocker";
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: CTX_MENU_ID,
    title: "Block this site",
    contexts: ["selection", "page", "link"] // Choose where it appears
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CTX_MENU_ID) {
    const url = URL.parse(info.pageUrl!);
    url && blacklistSite(url.origin);
  }
});
