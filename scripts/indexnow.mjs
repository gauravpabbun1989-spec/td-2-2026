const HOST = "ticketdepart.com";
const BASE_URL = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY || "d2671f2fe124045675597ca88dc4892e";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const urls = [
  "/", "/flight-booking", "/book-a-flight-by-phone", "/how-to-book-a-flight-by-phone",
  "/delta-airlines", "/united-airlines", "/american-airlines", "/southwest-airlines",
  "/jetblue-airways", "/alaska-airlines", "/british-airways", "/lufthansa",
  "/air-canada", "/swiss-air", "/qatar-airways", "/emirates", "/lot-polish-airlines",
  "/norse-atlantic-airways", "/contact", "/privacy", "/terms",
  "/international-flight-booking", "/last-minute-flight-booking", "/multi-city-flight-booking",
  "/group-flight-booking", "/cheap-flight-booking-by-phone", "/business-class-flight-booking",
  "/same-day-flight-booking", "/family-flight-booking", "/flight-change-assistance",
  "/flight-cancellation-assistance"
].map((path) => `${BASE_URL}${path}`);

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList: urls
  })
});

const body = await response.text();
console.log(`IndexNow response: ${response.status} ${response.statusText}`);
if (body) console.log(body);
if (!response.ok) process.exitCode = 1;
else console.log(`Submitted ${urls.length} URLs to IndexNow.`);
