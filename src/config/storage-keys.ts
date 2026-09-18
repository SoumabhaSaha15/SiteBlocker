export const KEYS = {
  blockedSites: "LINK-STORE",
  workingStatus: "WORKING-STATUS",
  redirectUrl: "REDIRECT-URL",
  rules: "RULES-STORE",
  passwordHash: "SITE-BLOCKER-HASH",
  passwordProtected: "PASSWORD-PROTECTED",
} as const;

// export const RESTRICTED_KEYS: string[] = [KEYS.passwordHash, KEYS.passwordProtected, KEYS.workingStatus];
export const ALLOWED_KEYS: string[] = [
  KEYS.blockedSites,
  KEYS.redirectUrl,
  KEYS.rules
];
