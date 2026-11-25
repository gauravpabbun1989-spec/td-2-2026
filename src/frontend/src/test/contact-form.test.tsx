import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  Cabin,
  SubmitError,
  type SubmitResult,
  type TripRequestInput,
  TripType,
} from "@/backend";
import { SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

/**
 * Typed local actor mock. `submitTripRequest` is the only backend method the
 * contact form calls; the mock records each input so the test can assert the
 * consumer contract (trimmed fields, `bigint` travelers, optional return date
 * and details, and the selected cabin).
 */
const submitTripRequest =
  vi.fn<(input: TripRequestInput) => Promise<SubmitResult>>();

vi.mock("@caffeineai/core-infrastructure", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@caffeineai/core-infrastructure")>();
  return {
    ...actual,
    useActor: () => ({
      actor: { submitTripRequest },
      isFetching: false,
    }),
  };
});

/**
 * The backend returns `#ok` only after the lead is durably stored, and the
 * success payload carries the stored record plus the notification-email
 * outcome. The form reads the stored lead from `result.ok.lead`.
 */
function okResult(input: TripRequestInput): SubmitResult {
  return {
    __kind__: "ok",
    ok: {
      lead: {
        id: 1n,
        name: input.name,
        phone: input.phone,
        email: input.email,
        tripType: input.tripType,
        origin: input.origin,
        destination: input.destination,
        departureDate: input.departureDate,
        returnDate: input.returnDate,
        travelers: input.travelers,
        cabin: input.cabin,
        details: input.details,
        submittedAt: 1_700_000_000_000_000_000n,
      },
      email: { __kind__: "sent", sent: null },
    },
  };
}

async function openContactForm() {
  renderRoute("/contact");
  await screen.findByRole("heading", {
    level: 1,
    name: /talk to a real travel specialist/i,
  });
}

/** Fills every required field for a round trip, including return date/cabin. */
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText(/add trip preferences \(optional\)/i));
  await user.type(screen.getByLabelText(/full name/i), "Jordan Ellis");
  await user.type(screen.getByLabelText(/^phone$/i), "3105550142");
  await user.type(screen.getByLabelText(/^email$/i), "jordan@example.com");
  await user.selectOptions(
    screen.getByLabelText(/trip type/i),
    TripType.roundTrip,
  );
  await user.type(screen.getByLabelText(/flying from/i), "Los Angeles (LAX)");
  await user.type(screen.getByLabelText(/flying to/i), "Tokyo (HND)");
  await user.type(screen.getByLabelText(/departure date/i), "2026-03-14");
  await user.type(screen.getByLabelText(/return date/i), "2026-03-28");
  await user.clear(screen.getByLabelText(/travelers/i));
  await user.type(screen.getByLabelText(/travelers/i), "2");
  await user.selectOptions(screen.getByLabelText(/cabin/i), Cabin.business);
}

describe("TripRequestForm", () => {
  beforeEach(() => {
    submitTripRequest.mockReset();
  });

  it("keeps the primary callback form short and makes trip preferences optional", async () => {
    await openContactForm();

    for (const label of [
      /full name/i,
      /^phone$/i,
      /^email$/i,
      /preferred callback time/i,
      /flying from/i,
      /flying to/i,
      /departure date/i,
      /return date/i,
      /travelers/i,
      /trip details \(optional\)/i,
    ]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }

    expect(screen.getByLabelText(/preferred callback time/i)).toHaveValue("Any time");
    const preferences = screen.getByText(/add trip preferences \(optional\)/i).closest("details");
    expect(preferences).not.toBeNull();
    expect(preferences).not.toHaveAttribute("open");
    expect(within(preferences as HTMLElement).getByLabelText(/trip type \(optional\)/i)).toBeInTheDocument();
    expect(within(preferences as HTMLElement).getByLabelText(/cabin \(optional\)/i)).toBeInTheDocument();

    await userEvent.setup().click(screen.getByText(/add trip preferences \(optional\)/i));
    expect(screen.getByLabelText(/trip type \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cabin \(optional\)/i)).toBeInTheDocument();
  });

  it("shows inline errors and does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    await openContactForm();

    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(/please enter your full name/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enter a phone number with at least 7 digits/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(submitTripRequest).not.toHaveBeenCalled();
  });

  it("submits a valid round trip and confirms success with the phone CTA", async () => {
    submitTripRequest.mockImplementation(async (input) => okResult(input));
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText(/request received/i)).toBeInTheDocument();
    expect(submitTripRequest).toHaveBeenCalledTimes(1);

    const input = submitTripRequest.mock.calls[0][0];
    expect(input).toMatchObject({
      name: "Jordan Ellis",
      phone: "3105550142",
      email: "jordan@example.com",
      tripType: TripType.roundTrip,
      origin: "Los Angeles (LAX)",
      destination: "Tokyo (HND)",
      departureDate: "2026-03-14",
      returnDate: "2026-03-28",
      cabin: Cabin.business,
    });
    expect(input.travelers).toBe(2n);
    expect(input.details).toContain("Preferred callback window: Any time (local time)");
    expect(input.details).toContain("Visitor time zone:");

    // The confirmation replaces the form and prominently shows the phone
    // number as a tappable tel: link.
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    const callLink = document.querySelector(
      '[data-ocid="contact.success.call_link"]',
    );
    expect(callLink).not.toBeNull();
    expect(callLink).toHaveAttribute("href", "tel:+18885649049");
    expect(callLink).toHaveTextContent(SITE.phoneDisplay);

    // The confirmation carries the exact accepted copy, including the colon
    // before the phone number, with the number itself as the tel: link.
    const confirmation = document.querySelector(
      '[data-ocid="contact.success_state"]',
    );
    expect(confirmation).not.toBeNull();
    expect(confirmation).toHaveTextContent(
      "Need help faster? Call a Travel Specialist: +1-888-564-9049",
    );
  });

  it("submits a one-way trip with an empty return date", async () => {
    submitTripRequest.mockImplementation(async (input) => okResult(input));
    const user = userEvent.setup();
    await openContactForm();

    await user.click(screen.getByText(/add trip preferences \(optional\)/i));
    await user.type(screen.getByLabelText(/full name/i), "Jordan Ellis");
    await user.type(screen.getByLabelText(/^phone$/i), "3105550142");
    await user.type(screen.getByLabelText(/^email$/i), "jordan@example.com");
    await user.selectOptions(
      screen.getByLabelText(/trip type/i),
      TripType.oneWay,
    );
    await user.type(screen.getByLabelText(/flying from/i), "Los Angeles (LAX)");
    await user.type(screen.getByLabelText(/flying to/i), "Tokyo (HND)");
    await user.type(screen.getByLabelText(/departure date/i), "2026-03-14");
    await user.clear(screen.getByLabelText(/travelers/i));
    await user.type(screen.getByLabelText(/travelers/i), "1");
    await user.selectOptions(
      screen.getByLabelText(/cabin/i),
      Cabin.noPreference,
    );
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText(/request received/i)).toBeInTheDocument();
    const input = submitTripRequest.mock.calls[0][0];
    expect(input.tripType).toBe(TripType.oneWay);
    expect(input.departureDate).toBe("2026-03-14");
    expect(input.returnDate).toBeUndefined();
    expect(input.cabin).toBe(Cabin.noPreference);
  });

  it("requires a return date for a round trip", async () => {
    const user = userEvent.setup();
    await openContactForm();
    await user.click(screen.getByText(/add trip preferences \(optional\)/i));

    await user.type(screen.getByLabelText(/full name/i), "Jordan Ellis");
    await user.type(screen.getByLabelText(/^phone$/i), "3105550142");
    await user.type(screen.getByLabelText(/^email$/i), "jordan@example.com");
    await user.selectOptions(
      screen.getByLabelText(/trip type/i),
      TripType.roundTrip,
    );
    await user.type(screen.getByLabelText(/flying from/i), "Los Angeles (LAX)");
    await user.type(screen.getByLabelText(/flying to/i), "Tokyo (HND)");
    await user.type(screen.getByLabelText(/departure date/i), "2026-03-14");
    await user.clear(screen.getByLabelText(/travelers/i));
    await user.type(screen.getByLabelText(/travelers/i), "2");
    await user.selectOptions(screen.getByLabelText(/cabin/i), Cabin.economy);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(/add a return date for this trip type/i),
    ).toBeInTheDocument();
    expect(submitTripRequest).not.toHaveBeenCalled();
  });

  it("submits a callback request without choosing trip type or cabin", async () => {
    submitTripRequest.mockImplementation(async (input) => okResult(input));
    const user = userEvent.setup();
    await openContactForm();

    await user.type(screen.getByLabelText(/full name/i), "Jordan Ellis");
    await user.type(screen.getByLabelText(/^phone$/i), "3105550142");
    await user.type(screen.getByLabelText(/^email$/i), "jordan@example.com");
    await user.type(screen.getByLabelText(/flying from/i), "Los Angeles (LAX)");
    await user.type(screen.getByLabelText(/flying to/i), "Tokyo (HND)");
    await user.type(screen.getByLabelText(/departure date/i), "2026-03-14");
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText(/request received/i)).toBeInTheDocument();
    const input = submitTripRequest.mock.calls[0][0];
    expect(input.tripType).toBe(TripType.other);
    expect(input.cabin).toBe(Cabin.noPreference);
    expect(input.travelers).toBe(1n);
    expect(input.details).toContain("Preferred callback window: Any time (local time)");
    expect(input.details).toContain("Visitor time zone:");
  });

  it("rejects a phone number with fewer than 7 digits", async () => {
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.clear(screen.getByLabelText(/^phone$/i));
    await user.type(screen.getByLabelText(/^phone$/i), "12345");
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(/enter a phone number with at least 7 digits/i),
    ).toBeInTheDocument();
    expect(submitTripRequest).not.toHaveBeenCalled();
  });

  it("rejects a traveler count below one", async () => {
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.clear(screen.getByLabelText(/travelers/i));
    await user.type(screen.getByLabelText(/travelers/i), "0");
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(/enter at least one traveler/i),
    ).toBeInTheDocument();
    expect(submitTripRequest).not.toHaveBeenCalled();
  });

  it("returns to an empty form after choosing to submit another request", async () => {
    submitTripRequest.mockImplementation(async (input) => okResult(input));
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));
    await screen.findByText(/request received/i);

    await user.click(
      screen.getByRole("button", { name: /submit another request/i }),
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue("");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("");
    expect(screen.getByLabelText(/departure date/i)).toHaveValue("");
    expect(screen.getByLabelText(/return date/i)).toHaveValue("");
    expect(screen.getByLabelText(/preferred callback time/i)).toHaveValue("Any time");
    expect(
      screen.getByRole("button", { name: /send my request/i }),
    ).toBeInTheDocument();
  });

  it("surfaces a backend validation error on the matching field", async () => {
    submitTripRequest.mockResolvedValue({
      __kind__: "err",
      err: SubmitError.invalidEmail,
    });
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(/enter a valid email address\./i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();
  });

  it("shows a recoverable error when the backend call rejects", async () => {
    submitTripRequest.mockRejectedValue(new Error("network down"));
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /could not send your request/i,
      );
    });
  });

  it("confirms success from the stored lead in the new #ok payload", async () => {
    // The backend returns `#ok` only after durable storage, and the stored
    // record lives at `result.ok.lead`. The form must read that payload rather
    // than assume the submitted input was stored.
    submitTripRequest.mockImplementation(async (input) => ({
      __kind__: "ok",
      ok: {
        lead: {
          id: 42n,
          name: "Stored Name",
          phone: input.phone,
          email: input.email,
          tripType: input.tripType,
          origin: input.origin,
          destination: input.destination,
          departureDate: input.departureDate,
          returnDate: input.returnDate,
          travelers: input.travelers,
          cabin: input.cabin,
          details: input.details,
          submittedAt: 1_700_000_000_000_000_000n,
        },
        email: { __kind__: "failed", failed: "smtp unavailable" },
      },
    }));
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    // A failed notification email does not block the stored-lead confirmation.
    expect(await screen.findByText(/request received/i)).toBeInTheDocument();

    // A failed internal notification is surfaced as an alert; the stored lead remains confirmed.
    const emailFailed = document.querySelector(
      '[data-ocid="contact.email_failed_state"]',
    );
    expect(emailFailed).not.toBeNull();
    expect(emailFailed).toHaveAttribute("role", "alert");
    expect(emailFailed).toHaveTextContent(/could not send an email notification to our team/i);
    expect(
      document.querySelector('[data-ocid="contact.email_sent_state"]'),
    ).toBeNull();
  });

  it("reports a sent notification email honestly in the success state", async () => {
    // The `#ok` payload carries the email outcome; a successful send must be
    // surfaced as sent, not as the failure alert.
    submitTripRequest.mockImplementation(async (input) => okResult(input));
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText(/request received/i)).toBeInTheDocument();

    const emailSent = document.querySelector(
      '[data-ocid="contact.email_sent_state"]',
    );
    expect(emailSent).not.toBeNull();
    expect(emailSent).toHaveTextContent(/our team has been notified by email/i);
    expect(emailSent).not.toHaveTextContent(/confirmation email/i);
    expect(
      document.querySelector('[data-ocid="contact.email_failed_state"]'),
    ).toBeNull();
  });

  it("does not confirm success when #ok carries no stored lead", async () => {
    // Defensive branch: `#ok` without a lead cannot confirm persistence, so the
    // form must not show the success state.
    submitTripRequest.mockResolvedValue({
      __kind__: "ok",
      ok: {
        lead: undefined,
        email: { __kind__: "sent", sent: null },
      },
    } as unknown as SubmitResult);
    const user = userEvent.setup();
    await openContactForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/we could not confirm your request/i),
      ).toBeInTheDocument();
    });
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();
  });
});
