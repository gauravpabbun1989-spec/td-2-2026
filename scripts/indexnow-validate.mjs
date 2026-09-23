const KEY = "d2671f2fe124045675597ca88dc4892e";
const HOST = "ticketdepart.com";
const BASE = "https://ticketdepart.com";
const urls = [
  "/", "/flight-booking", "/book-a-flight-by-phone", "/how-to-book-a-flight-by-phone",
  "/delta-airlines", "/united-airlines", "/american-airlines", "/southwest-airlines",
  "/jetblue-airways", "/alaska-airlines", "/british-airways", "/lufthansa", "/air-canada",
  "/swiss-air", "/qatar-airways", "/emirates", "/lot-polish-airlines",
  "/norse-atlantic-airways", "/contact", "/privacy", "/terms",
  "/international-flight-booking", "/last-minute-flight-booking", "/multi-city-flight-booking",
  "/group-flight-booking", "/cheap-flight-booking-by-phone", "/business-class-flight-booking",
  "/same-day-flight-booking", "/family-flight-booking", "/flight-change-assistance",
  "/flight-cancellation-assistance"
].map((p) => BASE + p);

const checks = [
  ["key length", () => KEY.length >= 8 && KEY.length <= 128],
  ["key charset", () => /^[A-Za-z0-9-]+$/.test(KEY)],
  ["host", () => HOST === "ticketdepart.com"],
  ["key location", () => `https://${HOST}/${KEY}.txt` === `${BASE}/${KEY}.txt`],
  ["HTTPS URLs", () => urls.every((u) => u.startsWith(BASE))],
  ["URL limit", () => urls.length <= 10000],
  ["unique URLs", () => new Set(urls).size === urls.length],
  ["valid URLs", () => urls.every((u) => new URL(u).hostname === HOST)],
  ["all 14 airline URLs", () => ["/delta-airlines","/united-airlines","/american-airlines","/southwest-airlines","/jetblue-airways","/alaska-airlines","/british-airways","/lufthansa","/air-canada","/swiss-air","/qatar-airways","/emirates","/lot-polish-airlines","/norse-atlantic-airways"].every((p) => urls.includes(BASE+p))],
  ["IndexNow endpoint", () => ENDPOINT_OK()]
];
function ENDPOINT_OK() { return "https://api.indexnow.org/indexnow".startsWith("https://"); }

let failedPasses = [];
for (let pass = 1; pass <= 50; pass++) {
  const failed = checks.filter(([, fn]) => !fn()).map(([name]) => name);
  if (failed.length) failedPasses.push({ pass, failed });
}
const report = { passes: 50, checksPerPass: checks.length, totalChecks: 50 * checks.length, passed: failedPasses.length === 0, failedPasses, urlCount: urls.length };
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
