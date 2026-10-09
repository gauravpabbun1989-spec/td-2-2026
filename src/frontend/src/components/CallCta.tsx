import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

type CallCtaProps = {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  ocid?: string;
  ctaLocation?: string;
  /** When true, show the canonical phone number as part of the visible CTA label. */
  showNumber?: boolean;
};

const sizeClasses = {
  sm: "h-10 px-4 text-sm gap-2",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
} as const;

const variantClasses = {
  solid: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-subtle hover:shadow-elevated",
  outline: "border border-primary/20 bg-card text-primary hover:bg-primary hover:text-primary-foreground",
  ghost: "text-primary hover:bg-primary/5",
} as const;

export function CallCta({
  variant = "solid",
  size = "md",
  className,
  ocid = "call.primary_button",
  ctaLocation,
  showNumber = false,
}: CallCtaProps) {
  return (
    <a
      href={SITE.phoneHref}
      data-ocid={ocid}
      data-cta-location={ctaLocation}
      aria-label={`${SITE.ctaLabel}: ${SITE.phoneDisplay}`}
      className={cn(
        "inline-flex min-w-0 items-center justify-center rounded-full font-semibold leading-tight tracking-tight text-center transition-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      <Phone aria-hidden="true" className="size-4 shrink-0" />
      <span className={cn("min-w-0 whitespace-normal text-center", showNumber && "flex flex-col")}>
        <span>{SITE.ctaLabel}</span>
        {showNumber ? <span aria-hidden="true">{SITE.phoneDisplay}</span> : null}
      </span>
    </a>
  );
}
