const HOST = "ticketdepart.com";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const BASE_URL = `https://${HOST}`;
const KEY = "d2671f2fe124045675597ca88dc4892e";
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
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
