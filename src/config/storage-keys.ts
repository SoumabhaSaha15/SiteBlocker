export const KEYS = {
  blockedSites: "LINK-STORE",
  workingStatus: "WORKING-STATUS",
  keywords:"KEYWORDS-STORE",
  redirectUrl: "REDIRECT-URL",
  rules: "RULES-STORE",
  passwordHash: "SITE-BLOCKER-HASH",
  passwordProtected: "PASSWORD-PROTECTED",
  blockedKeys:"KEYS-STORE",
  blockExtensionPage:"BLOCK-EXTESNION-PAGE",
  contextMenuShortcut:"CONTEXT-MENU-OPTION",
} as const;

export const ALLOWED_KEYS: string[] = [
  KEYS.blockedSites,
  KEYS.redirectUrl,
  KEYS.keywords,
  KEYS.rules,
  KEYS.blockedKeys
];
