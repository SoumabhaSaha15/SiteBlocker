import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(console.dir);

// Listen for clicks on the extension icon
browser.action.onClicked.addListener(() => {
  browser.tabs.create({
    url: browser.runtime.getURL("src/index.html"),
  });
});

// browser.action.
