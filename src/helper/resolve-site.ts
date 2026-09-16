import { getRuleList } from "@/utils/rules";
import { getRedirect } from "@/utils/redirect";
import { getBlockedSites } from "@/utils/sites";
import SiteBlockerError from "@/helper/site-blocker-error";
/**
 * @throws {SiteBlockerError}
 */
const ResolveSite = async (url: string) => {
  const requested_url = new URL(url);
  // const search_query = new URLSearchParams(requested_url.search);
  const redirect_url = await getRedirect();
  const blockedSites = await getBlockedSites();
  // const rules = await getRuleList();

  if (blockedSites.includes(requested_url.origin)) {

  }
}
