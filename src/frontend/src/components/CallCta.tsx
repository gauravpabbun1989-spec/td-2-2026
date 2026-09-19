import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { trackPhoneClick } from "@/lib/analytics";
import { Phone } from "lucide-react";

type CallCtaProps = {
  /** Visual treatment. `solid` for dark surfaces, `outline` for light ones. */
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Optional ocid override for deterministic testing. */
  ocid?: string;
  showNumber?: boolean;
};

const sizeClasses: Record<NonNullable<CallCtaProps["size"]>, string> = {
  sm: "h-10 px-4 text-sm gap-2",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

const variantClasses: Record<NonNullable<CallCtaProps["variant"]>, string> = {
  solid:
    "bg-accent text-accent-foreground hover:bg-accent/90 shadow-subtle hover:shadow-elevated",
  outline:
    "border border-primary/25 bg-card text-primary hover:bg-primary hover:text-primary-foreground",
  ghost: "text-primary hover:bg-primary/5",
};

/**
 * The single conversion control used across the site. Always a real tel: link
 * so mobile visitors can tap to call directly from search results.
 */
export function CallCta({
  variant = "solid",
  size = "md",
  className,
  ocid = "call.primary_button",
  showNumber = false,
}: CallCtaProps) {
  return (
    <a
      href={SITE.phoneHref}
      onClick={() => trackPhoneClick("primary_cta")}
      data-ocid={ocid}
      aria-label={`${SITE.ctaLabel} at ${SITE.phoneDisplay}`}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      <Phone aria-hidden="true" className="size-4 shrink-0" />
      <span className="whitespace-nowrap">
        {showNumber ? SITE.phoneDisplay : SITE.ctaLabel}
      </span>
    </a>
  );
}
