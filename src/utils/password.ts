import browser from 'webextension-polyfill';

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
const PASSWORD_KEY = 'SITE-BLOCKER-HASH';
const PASSWORD_PROTECTED_KEY = 'PASSWORD-PROTECTED';

export async function setAppPassword(newPassword: string): Promise<void> {
  const hash = await hashPassword(newPassword);
  await browser.storage.local.set({ [PASSWORD_KEY]: hash });
}

export async function getPasswordProtected(): Promise<boolean> {
  const result = await browser.storage.local.get(PASSWORD_PROTECTED_KEY);
  return result[PASSWORD_PROTECTED_KEY] === true;
}

export async function setPasswordProtected(passwordProtected: boolean): Promise<void> {
  await browser.storage.local.set({ [PASSWORD_PROTECTED_KEY]: passwordProtected });
}

export async function verifyAppPassword(inputPassword: string): Promise<boolean> {
  const result = await browser.storage.local.get(PASSWORD_KEY);
  const storedHash = result[PASSWORD_KEY];
  if (!storedHash) return false;
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
}
