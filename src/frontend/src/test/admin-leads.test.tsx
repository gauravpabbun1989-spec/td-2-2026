import { screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Cabin, type TripRequest, TripType } from "@/backend";
import { AdminLeadsPage } from "@/pages/AdminLeadsPage";
import { renderWithProviders } from "@/test/render-route";

/**
 * Admin leads desk coverage. The page is gated on an authenticated Internet
 * Identity session plus the backend `isCallerAdmin` role check, and it only
 * requests lead data once both pass. These tests drive the two hooks the page
 * reads — `useActor` and `useInternetIdentity` — with typed local mocks, so
 * they assert the observable gate: what a signed-out visitor, a signed-in
 * non-admin, and an admin each see, and whether lead data is ever requested.
 */

const mocks = vi.hoisted(() => ({
  isAuthenticated: false,
  isInitializing: false,
  isLoggingIn: false,
  login: vi.fn(),
  isCallerAdmin: vi.fn<() => Promise<boolean>>(),
  listLeads: vi.fn<() => Promise<TripRequest[]>>(),
}));

vi.mock("@caffeineai/core-infrastructure", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@caffeineai/core-infrastructure")>();
  return {
    ...actual,
    useActor: () => ({
      actor: {
        isCallerAdmin: mocks.isCallerAdmin,
        listLeads: mocks.listLeads,
      },
      isFetching: false,
    }),
    useInternetIdentity: () => ({
      isAuthenticated: mocks.isAuthenticated,
      isInitializing: mocks.isInitializing,
      isLoggingIn: mocks.isLoggingIn,
      login: mocks.login,
    }),
  };
});

/** A stored lead with every field the admin view renders. */
function lead(overrides: Partial<TripRequest> = {}): TripRequest {
  return {
    id: 1n,
    name: "Jordan Ellis",
    phone: "3105550142",
    email: "jordan@example.com",
    tripType: TripType.roundTrip,
    origin: "Los Angeles (LAX)",
    destination: "Tokyo (HND)",
    departureDate: "2026-03-14",
    returnDate: "2026-03-28",
    travelers: 2n,
    cabin: Cabin.business,
    details: "Window seats if possible",
    submittedAt: 1_700_000_000_000_000_000n,
    ...overrides,
  };
}

async function renderAdminLeads() {
  const result = renderWithProviders(<AdminLeadsPage />);
  await screen.findByRole("heading", {
    level: 1,
    name: /submitted leads/i,
  });
  return result;
}

describe("admin leads view", () => {
  beforeEach(() => {
    mocks.isAuthenticated = false;
    mocks.isInitializing = false;
    mocks.isLoggingIn = false;
    mocks.login.mockReset();
    mocks.isCallerAdmin.mockReset();
    mocks.listLeads.mockReset();
  });

  it("shows a sign-in prompt to a signed-out visitor and never reads leads", async () => {
    await renderAdminLeads();

    expect(
      document.querySelector('[data-ocid="admin.leads.signin_state"]'),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: /sign in with internet identity/i }),
    ).toBeInTheDocument();

    // No lead data is requested, and none is rendered.
    expect(mocks.isCallerAdmin).not.toHaveBeenCalled();
    expect(mocks.listLeads).not.toHaveBeenCalled();
    expect(screen.queryByText("Jordan Ellis")).not.toBeInTheDocument();
  });

  it("shows access denied to a signed-in non-admin and never reads leads", async () => {
    mocks.isAuthenticated = true;
    mocks.isCallerAdmin.mockResolvedValue(false);
    await renderAdminLeads();

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="admin.leads.denied_state"]'),
      ).not.toBeNull();
    });
    expect(
      screen.getByRole("heading", { name: /you do not have access to leads/i }),
    ).toBeInTheDocument();

    // The role check ran, but the lead read is gated behind it.
    expect(mocks.isCallerAdmin).toHaveBeenCalledTimes(1);
    expect(mocks.listLeads).not.toHaveBeenCalled();
    expect(screen.queryByText("Jordan Ellis")).not.toBeInTheDocument();
  });

  it("lists every stored lead with its full field set for an admin", async () => {
    mocks.isAuthenticated = true;
    mocks.isCallerAdmin.mockResolvedValue(true);
    mocks.listLeads.mockResolvedValue([
      lead({
        id: 2n,
        name: "Grace Hopper",
        phone: "3105550143",
        email: "grace@example.com",
        tripType: TripType.oneWay,
        origin: "New York (JFK)",
        destination: "London (LHR)",
        departureDate: "2026-04-01",
        returnDate: undefined,
        travelers: 1n,
        cabin: Cabin.economy,
        details: undefined,
        submittedAt: 1_700_000_100_000_000_000n,
      }),
      lead(),
    ]);
    await renderAdminLeads();

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="admin.leads.list"]'),
      ).not.toBeNull();
    });

    // Newest first: the order the backend returned is the order rendered.
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-ocid^="admin.leads.item."]',
      ),
    );
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Grace Hopper");
    expect(items[1]).toHaveTextContent("Jordan Ellis");

    // The newest lead carries every accepted field.
    const newest = within(items[0]);
    expect(newest.getByText("Lead #2")).toBeInTheDocument();
    expect(newest.getByText("Grace Hopper")).toBeInTheDocument();
    expect(newest.getByRole("link", { name: "3105550143" })).toHaveAttribute(
      "href",
      "tel:3105550143",
    );
    expect(
      newest.getByRole("link", { name: "grace@example.com" }),
    ).toHaveAttribute("href", "mailto:grace@example.com");
    expect(newest.getByText("One way")).toBeInTheDocument();
    expect(
      newest.getByText("New York (JFK) → London (LHR)"),
    ).toBeInTheDocument();
    expect(newest.getByText("Apr 1, 2026")).toBeInTheDocument();
    expect(newest.getByText("1")).toBeInTheDocument();
    expect(newest.getByText("Economy")).toBeInTheDocument();
    expect(newest.getByText("No additional details.")).toBeInTheDocument();

    // The older lead keeps its own values, including the return date and cabin.
    const older = within(items[1]);
    expect(older.getByText("Lead #1")).toBeInTheDocument();
    expect(older.getByText("Round trip")).toBeInTheDocument();
    expect(older.getByText("Business")).toBeInTheDocument();
    expect(older.getByText("Window seats if possible")).toBeInTheDocument();
    expect(older.getByText("Mar 28, 2026")).toBeInTheDocument();
  });

  it("shows an empty state when an admin has no leads", async () => {
    mocks.isAuthenticated = true;
    mocks.isCallerAdmin.mockResolvedValue(true);
    mocks.listLeads.mockResolvedValue([]);
    await renderAdminLeads();

    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="admin.leads.empty_state"]'),
      ).not.toBeNull();
    });
    expect(
      screen.getByRole("heading", {
        name: /no trip requests have been submitted/i,
      }),
    ).toBeInTheDocument();
    expect(document.querySelector('[data-ocid="admin.leads.list"]')).toBeNull();
  });
});
