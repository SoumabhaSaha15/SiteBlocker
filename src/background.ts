import browser from "webextension-polyfill";
import { isSiteBlocked } from "@/utils/links";
import { getWorkingStatus } from "@/utils/blocker";

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
      let targetUrl: string = "";

      if (blockResult) {
        // targetUrl = blockResult.redirectUrl;
        targetUrl = browser.runtime.getURL(
          `src/redirect.html?blockedUrl=${encodeURIComponent(tab.url)}`
        );
      }

      await browser.tabs.update(tabId, { url: targetUrl });
    }
  }
});
