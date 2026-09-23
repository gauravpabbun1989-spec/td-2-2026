import { Cabin, TripType, createActor } from "@/backend";
import type { TripRequest } from "@/backend";
import { Section } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Inbox,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Phone,
  Plane,
  ShieldAlert,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

const TRIP_TYPE_LABEL: Record<TripType, string> = {
  [TripType.roundTrip]: "Round trip",
  [TripType.oneWay]: "One way",
  [TripType.multiCity]: "Multi-city",
  [TripType.businessClass]: "Business class",
  [TripType.firstClass]: "First class",
  [TripType.groupTravel]: "Group travel",
  [TripType.other]: "Other",
};

const CABIN_LABEL: Record<Cabin, string> = {
  [Cabin.economy]: "Economy",
  [Cabin.premiumEconomy]: "Premium Economy",
  [Cabin.business]: "Business",
  [Cabin.first]: "First",
  [Cabin.noPreference]: "No preference",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Converts a Motoko nanosecond timestamp into a readable local date-time. */
function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime())
    ? "Unknown time"
    : dateFormatter.format(date);
}

function formatDate(value: string | undefined): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function DetailItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="label-board flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="min-w-0 break-words text-sm font-medium text-foreground">
        {children}
      </dd>
    </div>
  );
}

function LeadCard({ lead, index }: { lead: TripRequest; index: number }) {
  return (
    <article
      data-ocid={`admin.leads.item.${index + 1}`}
      className="rounded-2xl border border-border bg-card p-5 shadow-subtle sm:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="min-w-0">
          <p className="label-board text-accent">Lead #{lead.id.toString()}</p>
          <h3 className="mt-1.5 truncate text-lg font-semibold">{lead.name}</h3>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {formatTimestamp(lead.submittedAt)}
        </p>
      </header>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailItem
          icon={<Phone aria-hidden="true" className="size-3.5" />}
          label="Phone"
        >
          <a
            href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
            className="underline-offset-4 hover:text-accent hover:underline"
          >
            {lead.phone}
          </a>
        </DetailItem>
        <DetailItem
          icon={<Mail aria-hidden="true" className="size-3.5" />}
          label="Email"
        >
          <a
            href={`mailto:${lead.email}`}
            className="break-all underline-offset-4 hover:text-accent hover:underline"
          >
            {lead.email}
          </a>
        </DetailItem>
        <DetailItem
          icon={<Plane aria-hidden="true" className="size-3.5" />}
          label="Trip type"
        >
          {TRIP_TYPE_LABEL[lead.tripType]}
        </DetailItem>
        <DetailItem
          icon={<Plane aria-hidden="true" className="size-3.5" />}
          label="Route"
        >
          {lead.origin} → {lead.destination}
        </DetailItem>
        <DetailItem
          icon={<CalendarDays aria-hidden="true" className="size-3.5" />}
          label="Departure"
        >
          {formatDate(lead.departureDate)}
        </DetailItem>
        <DetailItem
          icon={<CalendarDays aria-hidden="true" className="size-3.5" />}
          label="Return"
        >
          {formatDate(lead.returnDate)}
        </DetailItem>
        <DetailItem
          icon={<Users aria-hidden="true" className="size-3.5" />}
          label="Travelers"
        >
          {lead.travelers.toString()}
        </DetailItem>
        <DetailItem
          icon={<Plane aria-hidden="true" className="size-3.5" />}
          label="Cabin"
        >
          {CABIN_LABEL[lead.cabin]}
        </DetailItem>
      </dl>

      <div className="mt-4 border-t border-border pt-4">
        <p className="label-board text-muted-foreground">Trip details</p>
        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
          {lead.details?.trim() ? lead.details : "No additional details."}
        </p>
      </div>
    </article>
  );
}

function StatePanel({
  icon,
  eyebrow,
  title,
  body,
  action,
  ocid,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-elevated"
    >
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <p className="label-board mt-5 text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

/**
 * Admin-only leads desk. Gated on an authenticated Internet Identity session
 * plus the backend `isCallerAdmin` role check; lead data is only requested
 * once both pass, so non-admins never receive it.
 */
export function AdminLeadsPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated, isInitializing, isLoggingIn, login } =
    useInternetIdentity();

  const adminQuery = useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  const isAdmin = adminQuery.data === true;

  const leadsQuery = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLeads();
    },
    enabled: isAdmin,
    retry: false,
  });

  const leads = leadsQuery.data ?? [];

  return (
    <>
      <Seo
        title="Leads Desk | TicketDepart"
        description="Private TicketDepart travel desk for reviewing submitted trip requests."
        path="/admin/leads"
      />

      <Section tone="paper" ocid="admin.leads.section">
        <p className="label-board text-accent">Travel desk</p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.08] sm:text-5xl">
          Submitted leads
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Every trip request captured from the contact form, newest first. This
          view is restricted to authorized travel desk administrators.
        </p>

        <div className="mt-10">
          {!isAuthenticated ? (
            <StatePanel
              ocid="admin.leads.signin_state"
              icon={<Lock aria-hidden="true" className="size-6" />}
              eyebrow="Restricted"
              title="Sign in to view leads"
              body="This page is limited to authorized travel desk administrators. Sign in with Internet Identity to continue."
              action={
                <button
                  type="button"
                  onClick={() => login()}
                  disabled={isInitializing || isLoggingIn}
                  data-ocid="admin.leads.signin_button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-base font-medium text-accent-foreground shadow-subtle transition-smooth hover:bg-accent/90 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isInitializing || isLoggingIn ? (
                    <Loader2
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                  ) : (
                    <LogIn aria-hidden="true" className="size-4" />
                  )}
                  {isInitializing
                    ? "Preparing sign-in…"
                    : isLoggingIn
                      ? "Signing in…"
                      : "Sign in with Internet Identity"}
                </button>
              }
            />
          ) : adminQuery.isLoading ? (
            <div
              data-ocid="admin.leads.loading_state"
              className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-muted-foreground shadow-subtle"
            >
              <Loader2 aria-hidden="true" className="size-5 animate-spin" />
              <span className="text-sm font-medium">Checking your access…</span>
            </div>
          ) : adminQuery.isError ? (
            <StatePanel
              ocid="admin.leads.error_state"
              icon={<ShieldAlert aria-hidden="true" className="size-6" />}
              eyebrow="Something went wrong"
              title="We could not verify your access"
              body="The travel desk could not confirm your administrator role just now. Please refresh the page and try again."
              action={
                <button
                  type="button"
                  onClick={() => void adminQuery.refetch()}
                  data-ocid="admin.leads.retry_button"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-primary/25 bg-card px-5 text-sm font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Try again
                </button>
              }
            />
          ) : !isAdmin ? (
            <StatePanel
              ocid="admin.leads.denied_state"
              icon={<ShieldAlert aria-hidden="true" className="size-6" />}
              eyebrow="Access denied"
              title="You do not have access to leads"
              body="Your account is signed in, but it is not an administrator of the TicketDepart travel desk. Ask the site owner to grant your account the admin role."
            />
          ) : leadsQuery.isLoading ? (
            <div
              data-ocid="admin.leads.loading_state"
              className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-muted-foreground shadow-subtle"
            >
              <Loader2 aria-hidden="true" className="size-5 animate-spin" />
              <span className="text-sm font-medium">Loading leads…</span>
            </div>
          ) : leadsQuery.isError ? (
            <StatePanel
              ocid="admin.leads.error_state"
              icon={<ShieldAlert aria-hidden="true" className="size-6" />}
              eyebrow="Something went wrong"
              title="We could not load the leads"
              body="The travel desk could not fetch submitted leads just now. Please try again."
              action={
                <button
                  type="button"
                  onClick={() => void leadsQuery.refetch()}
                  data-ocid="admin.leads.retry_button"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-primary/25 bg-card px-5 text-sm font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Try again
                </button>
              }
            />
          ) : leads.length === 0 ? (
            <StatePanel
              ocid="admin.leads.empty_state"
              icon={<Inbox aria-hidden="true" className="size-6" />}
              eyebrow="No leads yet"
              title="No trip requests have been submitted"
              body="When a traveler sends their trip details from the contact form, the request will appear here with its submission ID and timestamp."
            />
          ) : (
            <div className="flex flex-col gap-5">
              <p
                data-ocid="admin.leads.count"
                className="label-board text-muted-foreground"
              >
                {leads.length} {leads.length === 1 ? "lead" : "leads"}
              </p>
              <div data-ocid="admin.leads.list" className="flex flex-col gap-5">
                {leads.map((lead, index) => (
                  <LeadCard
                    key={lead.id.toString()}
                    lead={lead}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
