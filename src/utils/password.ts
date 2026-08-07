import browser from 'webextension-polyfill';

export const DEFAULT_PASSWORD = "site_blocker_webdude";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
const PASSWORD_KEY = 'site_blocker_password_hash_15_09_2003';

export async function setAppPassword(newPassword: string): Promise<void> {
  const hash = await hashPassword(newPassword);
  await browser.storage.local.set({ [PASSWORD_KEY]: hash });
}

export async function verifyAppPassword(inputPassword: string): Promise<boolean> {
  try {
    const result = await browser.storage.local.get(PASSWORD_KEY);
    const storedHash = result[PASSWORD_KEY];
    const inputHash = await hashPassword(inputPassword);
    return inputHash === storedHash;
  } catch (error) {
    const defaultHash = await hashPassword(DEFAULT_PASSWORD);
    return (await hashPassword(inputPassword)) === defaultHash;
  }
}