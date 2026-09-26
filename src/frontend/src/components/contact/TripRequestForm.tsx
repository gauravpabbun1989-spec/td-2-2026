import {
  Cabin,
  type EmailStatus,
  SubmitError,
  TripType,
  createActor,
} from "@/backend";
import {\n  trackCallbackFormError,\n  trackCallbackFormStart,\n  trackCallbackFormSubmit,\n  trackLeadSubmit,\n} from "@/lib/analytics";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Phone, Send } from "lucide-react";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

type FieldName =
  | "name"
  | "phone"
  | "email"
  | "tripType"
  | "origin"
  | "destination"
  | "departureDate"
  | "returnDate"
  | "travelers"
  | "cabin"
  | "details";

type FormValues = Record<FieldName, string>;

type FieldErrors = Partial<Record<FieldName, string>>;

const EMPTY_FORM: FormValues = {
  name: "",
  phone: "",
  email: "",
  tripType: "",
  origin: "",
  destination: "",
  departureDate: "",
  returnDate: "",
  travelers: "",
  cabin: "",
  details: "",
};

const TRIP_TYPE_OPTIONS: readonly { value: TripType; label: string }[] = [
  { value: TripType.roundTrip, label: "Round trip" },
  { value: TripType.oneWay, label: "One way" },
  { value: TripType.multiCity, label: "Multi-city" },
  { value: TripType.businessClass, label: "Business class" },
  { value: TripType.firstClass, label: "First class" },
  { value: TripType.groupTravel, label: "Group travel" },
  { value: TripType.other, label: "Something else" },
];

const CABIN_OPTIONS: readonly { value: Cabin; label: string }[] = [
  { value: Cabin.economy, label: "Economy" },
  { value: Cabin.premiumEconomy, label: "Premium Economy" },
  { value: Cabin.business, label: "Business" },
  { value: Cabin.first, label: "First" },
  { value: Cabin.noPreference, label: "No preference" },
];

const TRIP_TYPE_VALUES = new Set<string>(
  TRIP_TYPE_OPTIONS.map((option) => option.value),
);

const CABIN_VALUES = new Set<string>(
  CABIN_OPTIONS.map((option) => option.value),
);

/** Trip types that require a return date. */
const ROUND_TRIP_TYPES = new Set<string>([
  TripType.roundTrip,
  TripType.multiCity,
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Maps a backend SubmitError variant to the field it belongs to. */
const ERROR_FIELD: Record<SubmitError, FieldName> = {
  [SubmitError.invalidName]: "name",
  [SubmitError.invalidPhone]: "phone",
  [SubmitError.invalidEmail]: "email",
  [SubmitError.invalidOrigin]: "origin",
  [SubmitError.invalidDestination]: "destination",
  [SubmitError.invalidDepartureDate]: "departureDate",
  [SubmitError.invalidReturnDate]: "returnDate",
  [SubmitError.invalidTravelers]: "travelers",
};

const ERROR_MESSAGE: Record<SubmitError, string> = {
  [SubmitError.invalidName]: "Please enter the name we should ask for.",
  [SubmitError.invalidPhone]: "Enter a phone number we can reach you on.",
  [SubmitError.invalidEmail]: "Enter a valid email address.",
  [SubmitError.invalidOrigin]: "Tell us which city you are flying from.",
  [SubmitError.invalidDestination]: "Tell us where you would like to go.",
  [SubmitError.invalidDepartureDate]:
    "Choose the date you would like to depart.",
  [SubmitError.invalidReturnDate]:
    "Choose a return date on or after departure.",
  [SubmitError.invalidTravelers]: "Enter at least one traveler.",
};

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a phone number with at least 7 digits.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address, like you@example.com.";
  }
  if (!TRIP_TYPE_VALUES.has(values.tripType)) {
    errors.tripType = "Choose the type of trip you are planning.";
  }
  if (values.origin.trim().length < 2) {
    errors.origin = "Enter your departure city or airport.";
  }
  if (values.destination.trim().length < 2) {
    errors.destination = "Enter your destination city or airport.";
  }
  if (!values.departureDate) {
    errors.departureDate = "Choose the date you would like to depart.";
  }
  if (ROUND_TRIP_TYPES.has(values.tripType) && !values.returnDate) {
    errors.returnDate = "Add a return date for this trip type.";
  }
  if (
    values.departureDate &&
    values.returnDate &&
    values.returnDate < values.departureDate
  ) {
    errors.returnDate = "Return date cannot be before the departure date.";
  }
  const travelers = Number.parseInt(values.travelers, 10);
  if (!Number.isFinite(travelers) || travelers < 1) {
    errors.travelers = "Enter at least one traveler.";
  }
  if (!CABIN_VALUES.has(values.cabin)) {
    errors.cabin = "Choose a cabin preference.";
  }

  return errors;
}

const inputClasses =
  "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-base text-foreground shadow-subtle transition-smooth placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const selectClasses = cn(
  inputClasses,
  "appearance-none bg-[length:1rem] pr-10",
);

const labelClasses = "label-board text-muted-foreground";

type FieldProps = {
  id: FieldName;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
};

function Field({ id, label, error, children, className, hint }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          data-ocid={`contact.${id}.error_state`}
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Lead-capture form for the contact page. Validates inline, submits to the
 * backend `submitTripRequest` endpoint, and confirms in place on success.
 */
export function TripRequestForm() {
  const { actor } = useActor(createActor);
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);\n  const callbackStartedRef = useRef(false);

  const fallbackEmail = (() => {
    const subject = encodeURIComponent(
      `TicketDepart callback request - ${values.name || "Travel inquiry"}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${values.name}`,
        `Phone: ${values.phone}`,
        `Email: ${values.email}`,
        `Trip type: ${values.tripType}`,
        `From: ${values.origin}`,
        `To: ${values.destination}`,
        `Departure: ${values.departureDate}`,
        `Return: ${values.returnDate || "One-way"}`,
        `Travelers: ${values.travelers}`,
        `Cabin: ${values.cabin}`,
        `Trip details: ${values.details || "None"}`,
      ].join("\
"),
    );
    return `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  })();

  const mutation = useMutation({
    mutationFn: async (input: FormValues) => {
      if (!actor) throw new Error("Backend is not ready");
      const travelers = Number.parseInt(input.travelers, 10);
      const details = input.details.trim();
      const departureDate = input.departureDate;
      const returnDate = input.returnDate;
      return actor.submitTripRequest({
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        tripType: input.tripType as TripType,
        origin: input.origin.trim(),
        destination: input.destination.trim(),
        departureDate,
        travelers: BigInt(travelers),
        cabin: input.cabin as Cabin,
        ...(returnDate ? { returnDate } : {}),
        ...(details ? { details } : {}),
      });
    },
    onError: () => {
      trackCallbackFormError("contact_form", "submission");
    },
  });

  function handleFormFocus() {
    if (callbackStartedRef.current) return;
    callbackStartedRef.current = true;
    trackCallbackFormStart("contact_form");
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const name = event.target.name as FieldName;
    const { value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      trackCallbackFormError("contact_form", "validation");
      return;
    }

    trackCallbackFormSubmit("contact_form");
    mutation.mutate(values, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          // `#ok` carries SubmitSuccess { lead; email } and is returned only
          // after the lead is durably stored, so the stored record is read
          // from `result.ok.lead` before confirming in place. The email status
          // is surfaced honestly in the success state below.
          const { lead, email } = result.ok;
          if (!lead) {
            setErrors({
              name: "We could not confirm your request. Please try again.",
            });
            return;
          }
          setValues(EMPTY_FORM);
          setErrors({});
          setEmailStatus(email);
          trackLeadSubmit("contact_form");
          setSubmitted(true);
          return;
        }
        const field = ERROR_FIELD[result.err];
        setErrors({ [field]: ERROR_MESSAGE[result.err] });
      },
    });
  }

  if (submitted) {
    return (
      <output
        data-ocid="contact.success_state"
        className="block rounded-2xl border border-success/30 bg-card p-6 shadow-elevated sm:p-8"
      >
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 aria-hidden="true" className="size-6" />
        </span>
        <h3 className="mt-4 text-2xl font-semibold">Request received</h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Thank you — your callback request is with our travel desk. A
          specialist will review your trip details and follow up using the phone
          number and email you provided.
        </p>

        {emailStatus?.__kind__ === "sent" ? (
          <p
            data-ocid="contact.email_sent_state"
            className="mt-4 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success"
          >
            A confirmation email is on its way to the address you provided.
          </p>
        ) : emailStatus?.__kind__ === "failed" ? (
          <p
            role="alert"
            data-ocid="contact.email_failed_state"
            className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
          >
            Your request was received, but we could not send the confirmation
            email just now. Please keep this page or call us to confirm your
            trip.
          </p>
        ) : null}

        <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-5">
          <p className="text-base font-semibold text-foreground">
            Need help faster? Call a Travel Specialist:{" "}
            <a
              href="tel:+18555449001"
              data-ocid="contact.success.call_link"
              className="inline-flex min-h-11 items-center gap-2 align-middle text-xl font-semibold text-primary underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Phone aria-hidden="true" className="size-5" />
              +1 855-544-9001
            </a>
          </p>
        </div>

        <button
          type="button"
          data-ocid="contact.submit_another_button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-primary/25 bg-card px-5 text-sm font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Submit another request
        </button>
      </output>
    );
  }

  return (
    <form
      noValidate
      onFocusCapture={handleFormFocus}
      onSubmit={handleSubmit}
      data-ocid="contact.form"
      className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Jordan Ellis"
            className={cn(inputClasses, errors.name && "border-destructive")}
            data-ocid="contact.name.input"
          />
        </Field>

        <Field id="phone" label="Phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={handleChange}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            placeholder="(310) 555-0142"
            className={cn(inputClasses, errors.phone && "border-destructive")}
            data-ocid="contact.phone.input"
          />
        </Field>

        <Field
          id="email"
          label="Email"
          error={errors.email}
          className="sm:col-span-2"
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="you@example.com"
            className={cn(inputClasses, errors.email && "border-destructive")}
            data-ocid="contact.email.input"
          />
        </Field>

        <Field id="tripType" label="Trip type" error={errors.tripType}>
          <select
            id="tripType"
            name="tripType"
            value={values.tripType}
            onChange={handleChange}
            aria-invalid={errors.tripType ? true : undefined}
            aria-describedby={errors.tripType ? "tripType-error" : undefined}
            className={cn(
              selectClasses,
              !values.tripType && "text-muted-foreground/70",
              errors.tripType && "border-destructive",
            )}
            data-ocid="contact.tripType.select"
          >
            <option value="" disabled>
              Select a trip type
            </option>
            {TRIP_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field id="cabin" label="Cabin" error={errors.cabin}>
          <select
            id="cabin"
            name="cabin"
            value={values.cabin}
            onChange={handleChange}
            aria-invalid={errors.cabin ? true : undefined}
            aria-describedby={errors.cabin ? "cabin-error" : undefined}
            className={cn(
              selectClasses,
              !values.cabin && "text-muted-foreground/70",
              errors.cabin && "border-destructive",
            )}
            data-ocid="contact.cabin.select"
          >
            <option value="" disabled>
              Select a cabin
            </option>
            {CABIN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field id="origin" label="Flying from" error={errors.origin}>
          <input
            id="origin"
            name="origin"
            type="text"
            value={values.origin}
            onChange={handleChange}
            aria-invalid={errors.origin ? true : undefined}
            aria-describedby={errors.origin ? "origin-error" : undefined}
            placeholder="Los Angeles (LAX)"
            className={cn(inputClasses, errors.origin && "border-destructive")}
            data-ocid="contact.origin.input"
          />
        </Field>

        <Field id="destination" label="Flying to" error={errors.destination}>
          <input
            id="destination"
            name="destination"
            type="text"
            value={values.destination}
            onChange={handleChange}
            aria-invalid={errors.destination ? true : undefined}
            aria-describedby={
              errors.destination ? "destination-error" : undefined
            }
            placeholder="Tokyo (HND)"
            className={cn(
              inputClasses,
              errors.destination && "border-destructive",
            )}
            data-ocid="contact.destination.input"
          />
        </Field>

        <Field
          id="departureDate"
          label="Departure date"
          error={errors.departureDate}
        >
          <input
            id="departureDate"
            name="departureDate"
            type="date"
            value={values.departureDate}
            onChange={handleChange}
            aria-invalid={errors.departureDate ? true : undefined}
            aria-describedby={
              errors.departureDate ? "departureDate-error" : undefined
            }
            className={cn(
              inputClasses,
              errors.departureDate && "border-destructive",
            )}
            data-ocid="contact.departureDate.input"
          />
        </Field>

        <Field
          id="returnDate"
          label="Return date (optional)"
          error={errors.returnDate}
          hint="Leave blank for one-way trips."
        >
          <input
            id="returnDate"
            name="returnDate"
            type="date"
            value={values.returnDate}
            onChange={handleChange}
            aria-invalid={errors.returnDate ? true : undefined}
            aria-describedby={
              errors.returnDate ? "returnDate-error" : undefined
            }
            className={cn(
              inputClasses,
              errors.returnDate && "border-destructive",
            )}
            data-ocid="contact.returnDate.input"
          />
        </Field>

        <Field id="travelers" label="Travelers" error={errors.travelers}>
          <input
            id="travelers"
            name="travelers"
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            value={values.travelers}
            onChange={handleChange}
            aria-invalid={errors.travelers ? true : undefined}
            aria-describedby={errors.travelers ? "travelers-error" : undefined}
            placeholder="2"
            className={cn(
              inputClasses,
              errors.travelers && "border-destructive",
            )}
            data-ocid="contact.travelers.input"
          />
        </Field>

        <Field
          id="details"
          label="Trip details (optional)"
          error={errors.details}
          className="sm:col-span-2"
        >
          <textarea
            id="details"
            name="details"
            rows={4}
            value={values.details}
            onChange={handleChange}
            placeholder="Seat preferences, flexible dates, connections, baggage needs, or anything else we should know."
            className={cn(
              inputClasses,
              "h-auto min-h-28 resize-y py-3 leading-relaxed",
            )}
            data-ocid="contact.details.textarea"
          />
        </Field>
      </div>

      {mutation.isError ? (
        <p
          role="alert"
          data-ocid="contact.error_state"
          className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
        >
          We could not send your request just now. Your details are still on
          this form. Please try again, or use the email option below.
        </p>
      ) : null}

      {mutation.isError ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            data-ocid="contact.retry_button"
            onClick={() => mutation.mutate(values)}
            disabled={mutation.isPending}
            className="inline-flex h-11 items-center justify-center rounded-full border border-primary/25 bg-card px-5 text-sm font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
          >
            Try sending again
          </button>
          <a
            href={fallbackEmail}
            data-ocid="contact.email_fallback_link"
            className="inline-flex h-11 items-center justify-center rounded-full border border-accent/30 bg-accent/5 px-5 text-sm font-medium text-primary transition-smooth hover:bg-accent/10"
          >
            Email my trip details instead
          </a>
          <a
            href="tel:+18555449001"
            data-ocid="contact.error_call_link"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium text-primary transition-smooth hover:bg-muted"
          >
            Call +1 855-544-9001
          </a>
        </div>
      ) : null}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={mutation.isPending}
          data-ocid="contact.submit_button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-base font-medium text-accent-foreground shadow-subtle transition-smooth hover:bg-accent/90 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Send aria-hidden="true" className="size-4" />
          )}
          {mutation.isPending ? "Sending request…" : "Send my request"}
        </button>
        <p className="text-sm text-muted-foreground">
          Prefer to talk it through? Call{" "}
          <a
            href="tel:+18555449001"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            +1 855-544-9001
          </a>
          .
        </p>
      </div>
    </form>
  );
}
