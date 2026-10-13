import browser from "webextension-polyfill";
import { KEYS } from "@/config/storage-keys";
import { blacklistSite } from "@/utils/sites";
import { getRedirect } from "@/utils/redirect";
import ResolveSite from "@/helper/resolve-site";
import { getWorkingStatus } from "@/utils/blocker";
import type { ResolvedResult } from "@/types/interfaces";

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.storage.local
      .set({
        [KEYS.workingStatus]: true,
        [KEYS.blockExtensionPage]: false,
        [KEYS.contextMenuShortcut]: true,
      })
      .then(() => console.log("Keys initialized."))
      .catch(console.error);
  }
});

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
    const defaultGuard = new URL(
      browser.runtime.getURL("src/redirect/index.html"),
    );
    defaultGuard.search = new URLSearchParams(
      result as unknown as Record<string, string>,
    ).toString();
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

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && KEYS.contextMenuShortcut in changes) {
    browser.contextMenus.update(CTX_MENU_ID, {
      visible: Boolean(changes[KEYS.contextMenuShortcut].newValue),
    });
  }
});

browser.runtime.onInstalled.addListener(async () => {
  const { [KEYS.contextMenuShortcut]: enabled = false } =
    await browser.storage.local.get(KEYS.contextMenuShortcut);
  browser.contextMenus.create({
    id: CTX_MENU_ID,
    title: "Block this site",
    contexts: ["selection", "page", "link"], // Choose where it appears
    documentUrlPatterns: ["http://*/*", "https://*/*"],
    visible: !!enabled,
  });
  browser.contextMenus.create({
    id: CTX_ACTION_REPO_ID,
    title: "Visit GitHub Repository",
    contexts: ["action"],
  });
});

browser.contextMenus.onClicked.addListener((info) => {
  switch (info.menuItemId) {
    case CTX_MENU_ID: {
      const url = URL.parse(info.pageUrl!);
      if (url) return void blacklistSite(url.origin);
      break;
    }
    case CTX_ACTION_REPO_ID: {
      browser.tabs.create({
        url: "https://github.com/SoumabhaSaha15/SiteBlocker",
      });
      break;
    }
  }
});
