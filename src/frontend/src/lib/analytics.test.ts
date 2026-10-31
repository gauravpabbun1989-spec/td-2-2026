import { describe, expect, it } from "vitest";
import { isAnalyticsTestReferrer, isAnalyticsTestSession, isSuspiciousPath } from "./analytics";

describe("analytics suspicious-path filtering", () => {
  it.each([
    "/.htpasswd",
    "/%2ehtpasswd",
    "/%252ehtpasswd",
    "/%2eenv",
    "/%252e%67it/config",
    "/proc/self/environ",
    "/var/run/secrets/kubernetes.io/serviceaccount/token",
    "/wp-admin/install.php",
    "/api/env",
    "/server.key",
  ])("filters scanner/probe path %s, including encoded variants", (path) => {
    expect(isSuspiciousPath(path)).toBe(true);
  });

  it.each([
    "/",
    "/flight-booking",
    "/flights-usa-to-mexico",
    "/delta-airlines",
    "/contact",
  ])("does not filter legitimate site path %s", (path) => {
    expect(isSuspiciousPath(path)).toBe(false);
  });
});


describe("analytics QA-session detection", () => {
  it.each([
    "https://tagassistant.google.com/",
    "https://tagassistant.google.com/#/?id=preview",
  ])("recognizes Tag Assistant test referrer %s", (referrer) => {
    expect(isAnalyticsTestReferrer(referrer)).toBe(true);
  });

  it.each([
    "",
    "https://www.google.com/",
    "https://ticketdepart.com/",
    "not a URL",
  ])("does not classify normal or invalid referrer as QA: %s", (referrer) => {
    expect(isAnalyticsTestReferrer(referrer)).toBe(false);
  });
});


describe("analytics test-session filtering", () => {
  it.each([
    ["?td_analytics_debug=1", "", true],
    ["?gtm_debug=x", "", true],
    ["?gtm_preview=env-3", "", true],
    ["", "https://tagassistant.google.com/", true],
    ["", "https://www.google.com/", false],
    ["?utm_source=chatgpt.com", "https://chatgpt.com/", false],
    ["", "", false],
  ])("classifies search=%s referrer=%s as test=%s", (search, referrer, expected) => {
    expect(isAnalyticsTestSession(search, referrer)).toBe(expected);
  });
});
