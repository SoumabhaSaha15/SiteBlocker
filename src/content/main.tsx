import { StrictMode } from 'react';
import theme from "@/config/theme";
import App from "@/content/views/App";
import browser from "webextension-polyfill";
import { createRoot } from 'react-dom/client';
import { getRedirect } from "@/utils/redirect";
import ResolveSite from "@/helper/resolve-site";
import { getWorkingStatus } from "@/utils/blocker";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import type { ResolvedResult } from "@/types/interfaces";
import { StyledEngineProvider } from '@mui/material/styles';



(() => {
  const renderApp = (res: Required<ResolvedResult>) => {
    const container = document.createElement('div');
    container.id = 'SiteBlockerOverlay';
    document.body.replaceWith(container);
    createRoot(container).render(
      <StrictMode>
        <StyledEngineProvider enableCssLayer>
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App {...res} />
          </ThemeProvider>
        </StyledEngineProvider>
      </StrictMode>
    );
  };

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading" && tab.url) {
      const extensionUrlPrefix = browser.runtime.getURL("");
      if (tab.url.startsWith(extensionUrlPrefix)) return;
      const isRunning = await getWorkingStatus();
      if (!isRunning) return;
      let result: ResolvedResult = await ResolveSite(tab.url);
      if (!result.blocked) return;
      const redirect = await getRedirect();
      if (redirect) {
        result = await ResolveSite(redirect);
        if (!result.blocked)
          await browser.tabs.update(tabId, { url: redirect });
      }
      return renderApp(result as Required<ResolvedResult>);
    }
  });

})();
