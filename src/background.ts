import browser from "webextension-polyfill";
import { blacklistSite } from "@/utils/sites"
import { isSiteBlocked } from "@/utils/sites";
import { tryRedirect } from "@/utils/redirect";
import { getWorkingStatus } from "@/utils/blocker";

const CTX_MENU_ID = "webdude-site_blocker";

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
    const tabURL = URL.parse(tab.url);

    const blockResult = await isSiteBlocked(tabURL!.origin);
    if (blockResult) {
      let defaultGuard = browser.runtime.getURL(`src/redirect.html?blockedUrl=${encodeURIComponent(tab.url)}`);
      tryRedirect().then(url => {
        browser.tabs.update(tabId, { url });
      }).catch((_) => {
        browser.tabs.update(tabId, { url: defaultGuard });
      });
    }
  }
});


// browser.webNavigation.onBeforeNavigate.addListener(console.dir, { url: [{ schemes: ["http", "https"] }] });

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
