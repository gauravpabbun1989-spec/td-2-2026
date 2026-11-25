import { beforeEach, describe, expect, it } from "vitest";
import { capturePaidClickAttribution } from "./click-attribution";

function setSearch(search: string) {
  window.history.replaceState({}, "", search ? `/${search.startsWith("?") ? search : `?${search}`}` : "/");
}

describe("paid click ID capture", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    setSearch("");
  });

  it("captures and persists TrafficStars and ClickFlare IDs together", () => {
    setSearch("?click_id=ts-click-123&cf_click_id=cf-click-456&banner_id=creative-9");

    const captured = capturePaidClickAttribution();

    expect(captured).toMatchObject({
      clickId: "ts-click-123",
      clickFlareId: "cf-click-456",
      bannerId: "creative-9",
    });
    expect(JSON.parse(window.sessionStorage.getItem("ticketdepart_paid_click_attribution_v1") || "null")).toMatchObject({
      clickId: "ts-click-123",
      clickFlareId: "cf-click-456",
    });
    expect(JSON.parse(window.localStorage.getItem("ticketdepart_paid_click_attribution_v1") || "null")).toMatchObject({
      clickId: "ts-click-123",
      clickFlareId: "cf-click-456",
    });
  });

  it.each(["externalid", "external_id", "ExternalId"])(
    "recognizes ClickFlare External ID parameter %s",
    (parameter) => {
      setSearch(`?${parameter}=ts-click-789&cf_click_id=cf-click-789`);
      expect(capturePaidClickAttribution()).toMatchObject({
        clickId: "ts-click-789",
        clickFlareId: "cf-click-789",
      });
    },
  );

  it("keeps the captured pair when navigation drops the query string", () => {
    setSearch("?click_id=ts-click-111&cf_click_id=cf-click-222");
    capturePaidClickAttribution();
    setSearch("");

    expect(capturePaidClickAttribution()).toMatchObject({
      clickId: "ts-click-111",
      clickFlareId: "cf-click-222",
    });
  });

  it("does not attach a previous ClickFlare ID to a different TrafficStars click", () => {
    setSearch("?click_id=ts-old&cf_click_id=cf-old");
    capturePaidClickAttribution();
    setSearch("?click_id=ts-new");

    expect(capturePaidClickAttribution()).toMatchObject({
      clickId: "ts-new",
      clickFlareId: null,
    });
  });

  it("retains the same visit's ClickFlare ID when a redirect preserves only its TrafficStars ID", () => {
    setSearch("?click_id=ts-same&cf_click_id=cf-same");
    capturePaidClickAttribution();
    setSearch("?click_id=ts-same");

    expect(capturePaidClickAttribution()).toMatchObject({
      clickId: "ts-same",
      clickFlareId: "cf-same",
    });
  });

  it("keeps the session copy when persistent storage writes are blocked", () => {
    const originalSetItem = window.localStorage.setItem;
    Object.defineProperty(window.localStorage, "setItem", {
      configurable: true,
      value: () => { throw new Error("storage blocked"); },
    });
    try {
      setSearch("?click_id=ts-session&cf_click_id=cf-session");
      const captured = capturePaidClickAttribution();
      expect(captured).toMatchObject({ clickId: "ts-session", clickFlareId: "cf-session" });
      expect(window.sessionStorage.getItem("ticketdepart_paid_click_attribution_v1")).toContain("cf-session");
    } finally {
      delete (window.localStorage as Storage & { setItem?: Storage["setItem"] }).setItem;
      Object.defineProperty(window.localStorage, "setItem", {
        configurable: true,
        value: originalSetItem,
      });
    }
  });
});
