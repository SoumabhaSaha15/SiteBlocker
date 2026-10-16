export const KEYS = {
  blockedSites: "LINK-STORE",
  workingStatus: "WORKING-STATUS",
  keywords: "KEYWORDS-STORE",
  redirectUrl: "REDIRECT-URL",
  rules: "RULES-STORE",
  passwordHash: "SITE-BLOCKER-HASH",
  passwordProtected: "PASSWORD-PROTECTED",
  blockExtensionPage: "BLOCK-EXTESNION-PAGE",
  contextMenuShortcut: "CONTEXT-MENU-OPTION",
} as const;

export const ALLOWED_KEYS: (
  "LINK-STORE" | "REDIRECT-URL" | "KEYWORDS-STORE" | "RULES-STORE"
)[] = [KEYS.blockedSites, KEYS.redirectUrl, KEYS.keywords, KEYS.rules];
