import z from 'zod';
import browser from 'webextension-polyfill';

const statusParser = z.boolean().catch(false);
export type WorkingStatus = z.infer<typeof statusParser>;
const STATUS_KEY = "working-status";

export const getWorkingStatus: () => Promise<WorkingStatus> = async () => {
  const result = (await browser.storage.local.get(STATUS_KEY));
  return (statusParser.parse(result[STATUS_KEY]));
}

export const setWorkingStatus: (status: WorkingStatus) => Promise<WorkingStatus> = async (status) => {
  const parsedStatus = statusParser.parse(status);
  await browser.storage.local.set({ [STATUS_KEY]: parsedStatus });
  return parsedStatus;
}
