export const KEYS = {
  blockedSites: "LINK-STORE",
  workingStatus: "WORKING-STATUS",
  redirectUrl: "REDIRECT-URL",
  rules: "RULES-STORE",
  passwordHash: "SITE-BLOCKER-HASH",
  passwordProtected: "PASSWORD-PROTECTED",
  blockedKeys:"KEYS-STORE"
} as const;

export const ALLOWED_KEYS: string[] = [
  KEYS.blockedSites,
  KEYS.redirectUrl,
  KEYS.rules,
  KEYS.blockedKeys
];
