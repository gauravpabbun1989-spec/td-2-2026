const HOST = "ticketdepart.com";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const BASE_URL = `https://${HOST}`;
// Reuse the key already configured by the existing IndexNow workflow.
const KEY = "7f4c2b9e8a1d4635b0c9e2a6d7f8135b";
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
  const keyResponse = await fetch(KEY_LOCATION, {
    headers: { "User-Agent": "TicketDepart-IndexNow/1.0" }
  });
  if (!keyResponse.ok) {
    throw new Error(`IndexNow key file is not reachable: HTTP ${keyResponse.status} at ${KEY_LOCATION}`);
  }
  const servedKey = (await keyResponse.text()).trim();
  if (servedKey !== KEY) {
    throw new Error("The live IndexNow key file does not match the configured key.");
  }

  const sitemapResponse = await fetch(SITEMAP_URL, {
    headers: { "User-Agent": "TicketDepart-IndexNow/1.0" }
  });
  if (!sitemapResponse.ok) {
    throw new Error(`Could not fetch live sitemap: HTTP ${sitemapResponse.status}`);
  }

  const sitemap = await sitemapResponse.text();
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1].trim())
    .map((value) => value.replaceAll("&amp;", "&"));

  if (urls.length === 0) {
    throw new Error("The live sitemap contains no <loc> URLs.");
  }

  const normalized = urls.map((value) => {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== HOST || url.username || url.password) {
      throw new Error(`Unexpected URL in sitemap: ${value}`);
    }
    return url.href;
  });
  const uniqueUrls = [...new Set(normalized)];

  if (uniqueUrls.length > 10000) {
    throw new Error(`IndexNow supports at most 10,000 URLs per request; got ${uniqueUrls.length}.`);
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: uniqueUrls
    })
  });
  const body = await response.text();

  console.log(`Sitemap: ${SITEMAP_URL}`);
  console.log(`Unique same-host HTTPS URLs submitted: ${uniqueUrls.length}`);
  console.log(`IndexNow HTTP ${response.status}`);
  console.log(body || "(empty response)");

  if (!response.ok) {
    throw new Error(`IndexNow rejected the submission (HTTP ${response.status}).`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
