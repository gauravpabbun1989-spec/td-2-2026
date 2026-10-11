import { describe, expect, it } from "vitest";
import { isSuspiciousPath } from "./analytics";

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
