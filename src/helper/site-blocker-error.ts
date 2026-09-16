class SiteBlockerError extends Error {
  constructor(message: string, options: { cause: "SITE_BLOCKED" | "RULE_VIOLATION" | "ROUTINE_VIOLATION" | "KEYS_PROHIBITED" }) {
    super(message, options);
    Object.setPrototypeOf(this, SiteBlockerError.prototype);
  }
}

export default SiteBlockerError;
