import browser from "webextension-polyfill";
import { blacklistSite } from "@/utils/sites"
import ResolveSite from "@/helper/resolve-site";
import { getRedirect } from "@/utils/redirect";
import { getWorkingStatus } from "@/utils/blocker";
import type { ResolvedResult } from "@/types/interfaces";

browser.action.onClicked.addListener(() => {
  browser.tabs.create({
    url: browser.runtime.getURL("src/page/index.html"),
  });
});


browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && tab.url) {
    const extensionUrlPrefix = browser.runtime.getURL("");
    if (tab.url.startsWith(extensionUrlPrefix)) return;
    const isRunning = await getWorkingStatus();
    if (!isRunning) return;
    let result: ResolvedResult = await ResolveSite(tab.url);
    if (!result.blocked) return;
    const defaultGuard = new URL(browser.runtime.getURL("src/redirect/index.html"));
    defaultGuard.search = (new URLSearchParams(result as unknown as Record<string, any>)).toString();
    const redirect = await getRedirect();
    let target = defaultGuard.toString();
    if (redirect) {
      result = await ResolveSite(redirect);
      if (!result.blocked) target = redirect;
    }
    await browser.tabs.update(tabId, { url: target });
    return;
  }
});

const CTX_MENU_ID = "webdude-site_blocker";
const CTX_ACTION_REPO_ID = "webdude-action-repo";

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: CTX_MENU_ID,
    title: "Block this site",
    contexts: ["selection", "page", "link"] // Choose where it appears
  });
  browser.contextMenus.create({
    id: CTX_ACTION_REPO_ID,
    title: "Visit GitHub Repository",
    contexts: ["action"]
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case CTX_MENU_ID: {
      const url = URL.parse(info.pageUrl!);
      url && blacklistSite(url.origin);
      break;
    }
    case CTX_ACTION_REPO_ID: {
      browser.tabs.create({
        url: "https://github.com/SoumabhaSaha15/SiteBlocker"
      });
      break;
    }
  }
});
