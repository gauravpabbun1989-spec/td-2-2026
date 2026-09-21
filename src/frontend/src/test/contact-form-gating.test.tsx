import { screen, waitFor } from "@testing-library/react";
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
 * Characterization baseline for the callback form's submission gating and its
 * failure fallback — the behavior the upcoming request must preserve while it
 * moves storage to a stable canister and adds an email notification.
 *
 * The request intentionally changes *when* the backend confirms persistence,
 * but not the contract this file freezes: the success state is reachable only
 * from a successful backend result, never while the call is in flight and never
 * from a failure; and a failure keeps the visitor's details on the form and
 * offers the phone fallback. The success copy, the phone number, and the field
 * set are asserted elsewhere; this file is only about the gate.
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

/** Fills every required field for a one-way trip. */
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
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
  await user.selectOptions(screen.getByLabelText(/cabin/i), Cabin.economy);
}

describe("callback submission gating", () => {
  beforeEach(() => {
    submitTripRequest.mockReset();
  });

  it("does not show the success state while the backend call is in flight", async () => {
    // A promise the test resolves by hand, so the pending window is observable
    // rather than a race against a fast mock.
    let resolveSubmit: ((result: SubmitResult) => void) | undefined;
    submitTripRequest.mockImplementation(
      (input) =>
        new Promise<SubmitResult>((resolve) => {
          resolveSubmit = () => resolve(okResult(input));
        }),
    );

    const user = userEvent.setup();
    await openContactForm();
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    // The call is outstanding: the form is still on screen and the success
    // state has not appeared.
    await waitFor(() => {
      expect(submitTripRequest).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();

    resolveSubmit?.(okResult(submitTripRequest.mock.calls[0][0]));
    expect(await screen.findByText(/request received/i)).toBeInTheDocument();
  });

  it("keeps the visitor's details on the form and offers the phone fallback when storage fails", async () => {
    submitTripRequest.mockRejectedValue(new Error("storage unavailable"));
    const user = userEvent.setup();
    await openContactForm();
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    // The failure is surfaced, and the success state is not.
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /could not send your request/i,
      );
    });
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();

    // The entered values survive the failure so the visitor can retry.
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Jordan Ellis");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("jordan@example.com");
    expect(screen.getByLabelText(/flying to/i)).toHaveValue("Tokyo (HND)");

    // The failure offers the accepted phone fallback as a tappable tel: link.
    const callLink = document.querySelector(
      '[data-ocid="contact.error_call_link"]',
    );
    expect(callLink).not.toBeNull();
    expect(callLink).toHaveAttribute("href", SITE.phoneHref);
    expect(callLink).toHaveTextContent(SITE.phoneDisplay);
  });

  it("does not show the success state when the backend rejects the input", async () => {
    submitTripRequest.mockResolvedValue({
      __kind__: "err",
      err: SubmitError.invalidPhone,
    });
    const user = userEvent.setup();
    await openContactForm();
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(/enter a phone number we can reach you on\./i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();
    // A rejected input is a validation problem, not a storage failure, so the
    // recoverable-error alert must not appear.
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
