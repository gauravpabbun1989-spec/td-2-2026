import { screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderRoute } from "@/test/render-route";

/**
 * Characterization baseline for the header's Leads Desk link gating — adjacent
 * working behavior the request must preserve while it adds the private admin
 * leads desk. The link is the only in-app entry point to `/admin/leads`, and it
 * must be rendered for an authenticated administrator and for nobody else, so a
 * signed-out visitor or a signed-in non-admin never sees a route they cannot
 * use.
 *
 * The page-level gate (what `/admin/leads` itself shows) is asserted in
 * `admin-leads.test.tsx`; this file freezes only the header link's visibility.
 * The header is rendered through the real `Layout` inside the test router, so
 * the TanStack `Link` has the router context it requires.
 */

const mocks = vi.hoisted(() => ({
  isAuthenticated: false,
  isCallerAdmin: vi.fn<() => Promise<boolean>>(),
}));

vi.mock("@caffeineai/core-infrastructure", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@caffeineai/core-infrastructure")>();
  return {
    ...actual,
    useActor: () => ({
      actor: { isCallerAdmin: mocks.isCallerAdmin },
      isFetching: false,
    }),
    useInternetIdentity: () => ({
      isAuthenticated: mocks.isAuthenticated,
      isInitializing: false,
      isLoggingIn: false,
      login: vi.fn(),
    }),
  };
});

function header(): HTMLElement {
  const element = document.querySelector('[data-ocid="site.header"]');
  if (!element) throw new Error("site header not found");
  return element as HTMLElement;
}

function leadsDeskLink(): HTMLElement | null {
  return document.querySelector('[data-ocid="nav.link.leads_desk"]');
}

async function renderHeader() {
  renderRoute("/");
  await screen.findByRole("heading", { level: 1 });
}

describe("header Leads Desk link gating", () => {
  beforeEach(() => {
    mocks.isAuthenticated = false;
    mocks.isCallerAdmin.mockReset();
  });

  it("hides the Leads Desk link from a signed-out visitor and never checks the role", async () => {
    await renderHeader();

    expect(leadsDeskLink()).toBeNull();
    expect(mocks.isCallerAdmin).not.toHaveBeenCalled();
  });

  it("hides the Leads Desk link from a signed-in non-admin", async () => {
    mocks.isAuthenticated = true;
    mocks.isCallerAdmin.mockResolvedValue(false);
    await renderHeader();

    await waitFor(() => {
      expect(mocks.isCallerAdmin).toHaveBeenCalledTimes(1);
    });
    expect(leadsDeskLink()).toBeNull();
  });

  it("shows the Leads Desk link to an authenticated admin", async () => {
    mocks.isAuthenticated = true;
    mocks.isCallerAdmin.mockResolvedValue(true);
    await renderHeader();

    await waitFor(() => {
      expect(leadsDeskLink()).not.toBeNull();
    });
    expect(leadsDeskLink()).toHaveAttribute("href", "/admin/leads");
    expect(leadsDeskLink()).toHaveTextContent("Leads Desk");
  });

  it("keeps the Leads Desk link out of the primary nav for non-admins", async () => {
    mocks.isAuthenticated = true;
    mocks.isCallerAdmin.mockResolvedValue(false);
    await renderHeader();

    await waitFor(() => {
      expect(mocks.isCallerAdmin).toHaveBeenCalledTimes(1);
    });

    const primaryNav = within(header()).getByRole("navigation", {
      name: /primary/i,
    });
    expect(
      within(primaryNav).queryByRole("link", { name: "Leads Desk" }),
    ).not.toBeInTheDocument();
  });
});
